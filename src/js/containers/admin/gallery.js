import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { bindActionCreators } from 'redux';
import { request } from 'axios';
import { connect } from 'react-redux';
import { camelizeKeys } from 'humps';
import DocumentTitle from 'react-document-title';
import { compose, update, reject } from 'ramda';
import Dropzone from 'react-dropzone';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import * as actions from '../../reducers/gallery/actions';
import * as config from '../../miscellaneous/config';
import withStatuses from '../../behaviours/status';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        instance: state.config.axiosInstance,
        gallery: state.gallery.model
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
        model: PropTypes.object.isRequired,
        instance: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired
    };

    /**
     * @method del
     * @param {Object} model
     * @return {void}
     */
    del(model) {

        if (window.confirm(`Are you sure you want to delete this image?`)) {
            this.props.instance.delete(`/gallery/media/${model.id}.json`);
            this.props.onRemove(model);
        }

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { model } = this.props;
        const isPreview = model.preview;

        return (
            <li>
                <img src={isPreview ? model.preview : model.url} />
                {isPreview && <span>Uploading...</span>}
                {!isPreview && <a onClick={() => this.del(model)}>Delete</a>}
            </li>
        );

    }

});

/**
 * @class SortableList
 * @extends {Component}
 */
const SortableList = SortableContainer(props => {

    return (
        <ul>
            {props.items.map((model, index) => {
                const key = model.preview ? model.preview : hash(model);
                return <SortableItem key={key} {...props} index={index} model={model} />;
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
    return dispatch(actions.fetchGallery(params.id));
};

/**
 * @method enhance
 * @return {Object}
 */
const enhance = compose(withStatuses, connect(mapStateToProps, mapDispatchToProps));

/**
 * @class Meta
 * @extends {Component}
 */
export default enhance(class Galleries extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Gallery';

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
        gallery: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        instance: PropTypes.func.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                id: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
    };

    /**
     * @constant state
     * @type {Object}
     */
    state = {
        gallery: this.props.gallery
    };

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    submit(event) {

        event.preventDefault();
        this.props.setSending(true);

        this.props.instance.put(`/gallery/${this.props.match.params.id}.json`, this.state.gallery).then(response => {
            this.props.setSent(response.data.saved);
        });

    }

    /**
     * @method upload
     * @param {Array} files
     * @return {void}
     */
    upload(files) {

        // Append the temporary files to the gallery list.
        this.setState({ gallery: { ...this.state.gallery, media: [...this.state.gallery.media, ...files] } });

        files.forEach(async file => {

            const formData = new window.FormData();
            formData.append('image', file);

            const { data: response } = await request({
                url: `/api/gallery/${this.props.match.params.id}.json`,
                method: 'patch',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                transformResponse: [JSON.parse, camelizeKeys]
            });

            const index = this.state.gallery.media.findIndex(x => x === file);
            const media = update(index, response.image)(this.state.gallery.media);

            // Update the media with the temporary file having been replaced.
            this.setState({ gallery: { ...this.state.gallery, media } });

        });

    }

    /**
     * @method reorder
     * @param {Number} oldIndex
     * @param {Number} newIndex
     * @return {void}
     */
    reorder({ oldIndex, newIndex }) {

        // Reorder the media according to the new and old indices.
        const media = arrayMove(this.state.gallery.media, oldIndex, newIndex);

        this.setState({
            gallery: { ...this.state.gallery, media }
        });

    }

    /**
     * @method update
     * @param {String} key
     * @return {Function}
     */
    update(key) {

        return event => {
            this.setState({ gallery: { ...this.state.gallery, [key]: event.target.value } });
        };

    }

    /**
     * @method remove
     * @param {Object} model
     * @return {void}
     */
    remove(model) {
        const media = reject(x => x === model)(this.state.gallery.media);
        this.setState({ gallery: { ...this.state.gallery, media } });
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { gallery } = this.state;
        const { isDisabled, isSending, isError, isSuccess } = this.props;
        const isUploading = gallery.media.some(model => model.preview);

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Galleries`}>
                <section className="galleries">
                    <h1>Galleries</h1>

                    <form onSubmit={this.submit.bind(this)}>

                        {isSuccess && (
                            <section className="success">Gallery has been successfully saved.</section>
                        )}

                        {isError && (
                            <section className="error">There was a problem saving the gallery.</section>
                        )}

                        <details open>
                            <summary>General</summary>
                            <main>
                                <div className="name">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={gallery.name}
                                        onChange={this.update('name')}
                                        />
                                </div>

                                <div className="description">
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        name="description"
                                        value={gallery.description}
                                        onChange={this.update('description')}
                                        />
                                </div>
                            </main>
                        </details>

                        <details>
                            <summary>Media ({gallery.media.length})</summary>
                            <main>
                                <Dropzone onDrop={this.upload.bind(this)} />
                                <SortableList
                                    {...this.props}
                                    pressDelay={100}
                                    items={gallery.media}
                                    onRemove={this.remove.bind(this)}
                                    onSortEnd={this.reorder.bind(this)}
                                    />
                            </main>
                        </details>

                        <button type="submit" disabled={isSending || isDisabled || isUploading}>
                            {isSending ? 'Saving...' : (isUploading ? 'Uploading' : 'Save')}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
