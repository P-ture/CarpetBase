import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { generate } from 'shortid';
import slug from 'slug';
import hash from 'object-hash';
import * as actions from '../../reducers/page/actions';
import * as config from '../../miscellaneous/config';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        instance: state.config.axiosInstance,
        pages: state.page.list
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
    return dispatch(actions.fetchPages());
};

/**
 * @method enhance
 * @return {Object}
 */
const enhance = connect(mapStateToProps, mapDispatchToProps);

/**
 * @class Pages
 * @extends {Component}
 */
export default enhance(class Pages extends Component {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Pages';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired,
        pages: PropTypes.array.isRequired
    };

    /**
     * @method create
     * @param {String} title
     * @return {Promise}
     */
    async create(title) {

        try {

            const model = { title, slug: slug(title, { lower: true }) };
            const { data: response } = await this.props.instance.post('/page.json', model);

            // If it succeeds then we'll forward the user to that page.
            this.props.history.push(`/admin/page/${response.id}.html`);

        } catch (err) {

        }

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Pages`}>
                <section className="pages">
                    <h1>Pages</h1>

                    <button className="create" onClick={() => this.create(generate())}>
                        Create Page
                    </button>

                    <form>

                        {this.props.pages.map(model => {

                            return (
                                <li key={hash(model)}>
                                    {model.title}
                                    <a href={`/admin/page/${model.id}.html`}>Edit</a>
                                    <a href={`/${model.slug}.html`}>View</a>
                                </li>
                            );

                        })}

                    </form>
                </section>
            </DocumentTitle>
        );

    }

});
