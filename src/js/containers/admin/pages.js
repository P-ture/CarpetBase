import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { withRouter } from 'react-router-dom';
import hash from 'object-hash';
import * as actions from '../../reducers/page/actions';
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
 * @class Pages
 * @extends {Component}
 */
export default withRouter(withStatuses(connect(mapStateToProps, mapDispatchToProps)(class Pages extends Component {

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
        pages: PropTypes.array.isRequired,
        isDisabled: PropTypes.bool.isRequired
    };

    /**
     * @constant meta
     * @type {Object}
     */
    state = {
        page: null
    };

    /**
     * @method redirect
     * @param {Object} event
     * @return {Promise}
     */
    redirect(event) {
        event.preventDefault();
        window.location.href = `/admin/page/${event.target.value}.html`;
    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { isDisabled } = this.props;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Pages`}>
                <section className="pages">
                    <h1>Pages</h1>
                    <form>
                        <p>Choose the page to edit:</p>
                        <select disabled={isDisabled} onChange={this.redirect.bind(this)}>

                            <option>...</option>

                            {this.props.pages.map(page => {
                                return <option key={hash(page)} value={page.slug}>{page.title}</option>;
                            })}

                        </select>
                    </form>
                </section>
            </DocumentTitle>
        );

    }

})));
