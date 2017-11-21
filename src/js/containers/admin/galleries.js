import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { compose } from 'ramda';
import { generate } from 'shortid';
import slug from 'slug';
import * as actions from '../../reducers/config/actions';
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
        meta: state.config.meta
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
    return dispatch(actions.fetchMeta());
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
            post: PropTypes.func.isRequired
        }).isRequired
    };

    /**
     * @method create
     * @param {String} name
     * @return {Promise}
     */
    async create(name) {

        try {
            await this.props.instance.post('/gallery.json', { name, slug: slug(name) });
        } catch (err) {

        }

        // If it succeeds then we'll forward the user to that page.
        this.props.history.push(`/admin/gallery/${slug(name)}.html`);

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
                </section>
            </DocumentTitle>
        );

    }

});
