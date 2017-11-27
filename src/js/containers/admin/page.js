import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { request } from 'axios';
import DocumentTitle from 'react-document-title';
import { compose, append, reject, contains, dissoc } from 'ramda';
import hash from 'object-hash';
import { camelizeKeys } from 'humps';
import Dropzone from 'react-dropzone';
import slug from 'slug';
import { withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import * as pageActions from '../../reducers/page/actions';
import * as galleryActions from '../../reducers/gallery/actions';
import * as config from '../../miscellaneous/config';
import withStatuses from '../../behaviours/status';

/**
 * @constant actions
 * @type {Object}
 */
const actions = { ...pageActions, ...galleryActions };

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        instance: state.config.axiosInstance,
        page: state.page.content,
        layouts: state.page.layouts,
        galleries: state.gallery.list
    };

};

/**
 * @method mapDispatchToProps
 * @param {Function} dispatch
 * @return {Object}
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
};

/**
 * @class SortableItem
 * @extends {Component}
 */
const SortableItem = SortableElement(({ model }) => {

    return (
        <li>
            {model.name}
            <a href={`/admin/gallery/${model.id}.html`}>Edit</a>
        </li>
    );

});

/**
 * @class SortableList
 * @extends {Component}
 */
const SortableList = SortableContainer(({ items }) => {

    return (
        <ul>
            {items.map((model, index) => {
                return <SortableItem key={hash(model)} index={index} model={model} />;
            })}
        </ul>
    );

});

/**
 * @method fetch
 * @param {Function} dispatch
 * @param {Object} params
 * @return {Promise}
 */
export const fetch = ({ dispatch, params }) => {

    return Promise.all([
        dispatch(actions.fetchLayouts()),
        dispatch(actions.fetchPage(params.id)),
        dispatch(actions.fetchGalleries())
    ]);

};

/**
 * @method enhance
 * @return {Object}
 */
const enhance = compose(withStatuses, connect(mapStateToProps, mapDispatchToProps), withRouter);

/**
 * @class Page
 * @extends {Component}
 */
export default enhance(class Page extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Page';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        setSending: PropTypes.func.isRequired,
        setSent: PropTypes.func.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isSending: PropTypes.bool.isRequired,
        isError: PropTypes.bool.isRequired,
        isSuccess: PropTypes.bool.isRequired,
        layouts: PropTypes.array.isRequired,
        galleries: PropTypes.array.isRequired,
        page: PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired
        }).isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                id: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        instance: PropTypes.func.isRequired
    };

    /**
     * @constant page
     * @type {Object}
     */
    state = {
        page: this.props.page,
        error: null
    };

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    submit(event) {

        event.preventDefault();
        this.props.setSending(true);

        const strip = compose(dissoc('hero'), dissoc('mediaId'));
        const model = strip({ ...this.state.page, slug: slug(this.state.page.title, { lower: true }) });

        this.props.instance.put(`/page/${this.props.match.params.id}.json`, model).then(response => {
            this.setState({ error: response.data.error });
            this.props.setSent(response.data.saved);
        });

    }

    /**
     * @method reorder
     * @param {Number} oldIndex
     * @param {Number} newIndex
     * @return {void}
     */
    reorder({ oldIndex, newIndex }) {

        // Reorder the galleries according to the new and old indices.
        const galleries = arrayMove(this.state.page.galleries, oldIndex, newIndex);

        this.setState({
            page: { ...this.state.page, galleries }
        });

    }

    /**
     * @method update
     * @param {String} key
     * @return {Function}
     */
    update(key) {

        return event => {
            const isNumber = /^[0-9]$/.test(event.target.value);
            const value = isNumber ? Number(event.target.value) : event.target.value;
            this.setState({ page: { ...this.state.page, [key]: value } });
        };

    }

    /**
     * @method toggle
     * @param {Object} event
     * @return {void}
     */
    toggle(event) {

        const gallery = this.props.galleries.find(model => model.id === Number(event.target.value));

        // Either append to the gallery list or remove.
        const galleries = event.target.checked ? append(gallery)(this.state.page.galleries) :
                          reject(model => model.id === Number(event.target.value))(this.state.page.galleries);

        // Update the list of galleries associated to the current page.
        this.setState({ page: { ...this.state.page, galleries } });

    }

    /**
     * @method upload
     * @param {Object} file
     * @return {Promise}
     */
    async upload([file]) {

        this.setState({ page: { ...this.state.page, hero: file } });

        const formData = new window.FormData();
        formData.append('image', file);

        const { data: response } = await request({
            url: `/api/page/${this.props.match.params.id}/media.json`,
            method: 'patch',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            transformResponse: [JSON.parse, camelizeKeys]
        });

        this.setState({ page: { ...this.state.page, hero: response.image } });

    }

    /**
     * @method del
     * @param {Object} model
     * @return {void}
     */
    del(model) {

        if (window.confirm(`Are you sure you want to delete this image?`)) {
            this.props.instance.delete(`/gallery/media/${model.id}.json`);
            this.setState({ page: { ...this.state.page, hero: null } });
        }

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.state;
        const { layouts, galleries, isDisabled, isSending, isError, isSuccess } = this.props;
        const selectedGalleryIds = page.galleries.map(model => model.id);

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Page`}>
                <section className="pages">
                    <h1>Pages</h1>
                    <form onSubmit={this.submit.bind(this)}>

                        {isSuccess && (
                            <section className="success">Page has been successfully saved.</section>
                        )}

                        {isError && (
                            <section className="error">There was a problem saving the page: {this.state.error}.</section>
                        )}

                        <details className="general" open>
                            <summary>General</summary>
                            <main>
                                <div className="title">
                                    <label htmlFor="title">Title:</label>
                                    <input type="text" name="title" value={page.title} onChange={this.update('title')} />
                                </div>
                                
                                <div className="content">
                                    <label htmlFor="content">Content:</label>
                                    <textarea name="content" value={page.content} onChange={this.update('content')} />
                                </div>
                            </main>
                        </details>

                        <details className="hero">
                            <summary>Hero</summary>
                            <main>
                                <label>Hero Banner:</label>
                                <Dropzone onDrop={this.upload.bind(this)}>
                                    {page.hero && <img src={page.hero.preview ? page.hero.preview : page.hero.url} />}
                                </Dropzone>
                                {page.hero && (
                                    <div>
                                        {page.hero.preview && <span>Uploading...</span>}
                                        {!page.hero.preview && <a onClick={() => this.del(page.hero)}>Delete</a>}
                                    </div>
                                )}
                            </main>
                        </details>

                        <details className="layout">
                            <summary>Layout</summary>
                            <main>
                                <ul>
                                
                                    {layouts.map((layout, index) => {

                                        const id = `layout-${index}`;

                                        return (
                                            <li key={hash(layout)}>
                                                <label htmlFor={id}>{layout.name}</label>
                                                <input
                                                    type="radio"
                                                    id={id}
                                                    value={layout.id}
                                                    checked={layout.id === page.layoutId}
                                                    onChange={this.update('layoutId')}
                                                    />
                                            </li>
                                        );

                                    })}

                                </ul>
                            </main>
                        </details>

                        {galleries.length > 0 && (

                            <details className="galleries">
                                <summary>Galleries ({page.galleries.length}/{galleries.length})</summary>
                                <main>

                                    <ul className="selected-galleries">
                                        <SortableList
                                            pressDelay={100}
                                            items={page.galleries}
                                            onSortEnd={this.reorder.bind(this)}
                                            />
                                    </ul>

                                    <ul className="available-galleries">

                                        {galleries.map(model => {

                                            return (
                                                <li key={hash(model)}>
                                                    <input
                                                        type="checkbox"
                                                        id={model.slug}
                                                        value={model.id}
                                                        checked={contains(model.id)(selectedGalleryIds)}
                                                        onChange={this.toggle.bind(this)}
                                                        />
                                                    <label htmlFor={model.slug}>{model.name}</label>
                                                </li>
                                            );

                                        })}

                                    </ul>

                                </main>
                            </details>

                        )}

                        <button type="submit" disabled={isSending || isDisabled}>
                            {isSending ? 'Saving...' : 'Save'}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
