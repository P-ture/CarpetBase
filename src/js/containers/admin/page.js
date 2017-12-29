import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { request } from 'axios';
import DocumentTitle from 'react-document-title';
import { compose, append, reject, contains, dissoc, update } from 'ramda';
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
        pages: state.page.list,
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
const SortableItem = SortableElement(class extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        model: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            pageLinkId: PropTypes.number
        }).isRequired,
        page: PropTypes.shape({
            layoutId: PropTypes.oneOf([1, 2])
        }).isRequired,
        pages: PropTypes.array.isRequired,
        onLinkChange: PropTypes.func.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model, page, pages, onLinkChange } = this.props;

        return (
            <li>
                <p>{model.name}:</p>

                {pages.length > 0 && (

                    <section className="page-link">

                        {page.layoutId === 2 && <p>Disabled because link isn&apos;t relevant for gallery layouts.</p>}

                        <select
                            name="page-link"
                            value={model.pageLinkId ? model.pageLinkId : ''}
                            disabled={page.layoutId === 2}
                            onChange={({ target }) => onLinkChange(model, target.value ? Number(target.value) : null)}
                            >
                            <option value="">None</option>

                            <optgroup label="Pages:">
                                {pages.map(page => {
                                    return <option key={hash(page)} value={page.id}>{page.title}</option>;
                                })}
                            </optgroup>

                        </select>

                    </section>

                )}

                <a href={`/admin/gallery/${model.id}.html`}>Edit</a>

            </li>
        );

    }

});

/**
 * @class SortableList
 * @extends {Component}
 */
const SortableList = SortableContainer(class extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <ul>
                {this.props.items.map((model, index) => {
                    return <SortableItem key={hash(model)} {...this.props} index={index} model={model} />;
                })}
            </ul>
        );

    }

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
        dispatch(actions.fetchPages()),
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
        pages: PropTypes.array.isRequired,
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

        const strip = compose(dissoc('hero'), dissoc('mediaId'), dissoc('link'));
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
            const value = isNumber ? Number(event.target.value) : (event.target.value === '' ? null : event.target.value);
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
     * @method changeLink
     * @param {Object} model
     * @param {Number|null} pageLinkId
     * @return {void}
     */
    changeLink(model, pageLinkId) {

        // Update the page link at the index.
        const index = this.state.page.galleries.findIndex(x => x === model);
        const galleries = update(index, { ...model, pageLinkId })(this.state.page.galleries);
        this.setState({ page: { ...this.state.page, galleries } });

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.state;
        const { layouts, galleries, pages, isDisabled, isSending, isError, isSuccess } = this.props;
        const selectedGalleryIds = page.galleries.map(model => model.id);

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Page`}>
                <section className="page">
                    <h1>Page</h1>
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
                                <Dropzone style={{}} onDrop={this.upload.bind(this)} />
                                {page.hero && (
                                    <section className="preview">
                                        <img src={page.hero.preview ? page.hero.preview : `/media/${page.hero.filename}`} />
                                        {page.hero.preview && <span>Uploading...</span>}
                                        {!page.hero.preview && <a onClick={() => this.del(page.hero)}>Delete</a>}
                                    </section>
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
                                                <input
                                                    type="radio"
                                                    id={id}
                                                    value={layout.id}
                                                    checked={layout.id === page.layoutId}
                                                    onChange={this.update('layoutId')}
                                                    />
                                                <label htmlFor={id}>{layout.name}</label>
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
                                    <h3>Active Galleries</h3>
                                    {galleries.length > 0 && (

                                        <div className="featured">
                                            <label htmlFor="featured-gallery">Featured gallery:</label>
                                            <select
                                                onChange={this.update('featuredGalleryId')}
                                                value={page.featuredGalleryId ? page.featuredGalleryId : ''}
                                                >
                                                <option value="">None</option>
                                                <optgroup label="Galleries">
                                                    {galleries.map(model => {
                                                        return (
                                                            <option key={hash(model)} value={model.id}>
                                                                {model.name}
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            </select>
                                            <select
                                                onChange={this.update('featuredPageId')}
                                                value={page.featuredPageId ? page.featuredPageId : ''}
                                                >
                                                <option value="">None</option>
                                                <optgroup label="Pages">
                                                    {pages.map(model => {
                                                        return (
                                                            <option key={hash(model)} value={model.id}>
                                                                {model.title}
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            </select>
                                        </div>

                                    )}
                                    <ul className="selected-galleries">
                                        <SortableList
                                            {...this.props}
                                            page={page}
                                            distance={1}
                                            items={page.galleries}
                                            onSortEnd={this.reorder.bind(this)}
                                            onLinkChange={this.changeLink.bind(this)}
                                            />
                                    </ul>

                                    <h3>Available Galleries</h3>

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
