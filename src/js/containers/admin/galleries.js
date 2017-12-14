import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hash from 'object-hash';
import DocumentTitle from 'react-document-title';
import { compose } from 'ramda';
import { generate } from 'shortid';
import * as configActions from '../../reducers/config/actions';
import * as galleryActions from '../../reducers/gallery/actions';
import * as config from '../../miscellaneous/config';
import withStatuses from '../../behaviours/status';

/**
 * @constant actions
 * @type {Object}
 */
const actions = { ...configActions, ...galleryActions };

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        instance: state.config.axiosInstance,
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
 * @method fetch
 * @param {Function} dispatch
 * @return {Promise}
 */
export const fetch = ({ dispatch }) => {
    return dispatch(actions.fetchGalleries());
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
    static displayName = 'Admin/Galleries';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired,
        galleries: PropTypes.array.isRequired,
        instance: PropTypes.func.isRequired
    };

    /**
     * @method create
     * @param {String} name
     * @return {Promise}
     */
    async create(name) {

        try {

            // Attempt to create the gallery with the random name.
            const { data: response } = await this.props.instance.post('/gallery.json', { name });

            // If it succeeds then we'll forward the user to that page.
            this.props.history.push(`/admin/gallery/${response.id}.html`);

        } catch (err) {

        }

    }

    /**
     * @method delete
     * @param {Object} model
     * @return {Promise}
     */
    async delete(model) {

        if (window.confirm(`Are you sure you want to delete the ${model.name.toLowerCase()} gallery?`)) {
            await this.props.instance.delete(`/gallery/${model.id}.json`);
            window.location.reload();
        }

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Galleries`}>
                <section className="galleries">
                    <h1>Galleries</h1>

                    <button className="create" onClick={() => this.create(generate())}>
                        Create Gallery
                    </button>

                    <ul>
                        {this.props.galleries.map(model => {
                            console.log(model);
                            return (
                                <li key={hash(model)}>
                                    <label>{model.name}</label>
                                    <a href={`/admin/gallery/${model.id}.html`}>Edit</a>
                                    <a onClick={() => this.delete(model)}>Delete</a>
                                </li>
                            );

                        })}

                    </ul>

                </section>
            </DocumentTitle>
        );

    }

});
