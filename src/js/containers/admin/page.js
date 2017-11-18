import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { withRouter } from 'react-router-dom';
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
        page: state.page.content
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
 * @param {Object} params
 * @return {Promise}
 */
export const fetch = ({ dispatch, params }) => {
    return dispatch(actions.fetchPage(params.page || actions.HOME));
};

/**
 * @class Page
 * @extends {Component}
 */
export default withRouter(withStatuses(connect(mapStateToProps, mapDispatchToProps)(class Page extends Component {

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
        page: PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired
        }).isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                page: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        instance: PropTypes.func.isRequired
    };

    /**
     * @constant page
     * @type {Object}
     */
    state = {
        page: this.props.page
    };

    /**
     * @method submit
     * @param {Object} event
     * @return {Promise}
     */
    submit(event) {

        event.preventDefault();

        this.props.setSending(true);

        this.props.instance.post(`/page/${this.props.match.params.page}.json`, this.state.page).then(response => {
            this.props.setSent(response.data.saved);
        });

    }

    /**
     * @method update
     * @param {String} key
     * @return {Function}
     */
    update(key) {

        return event => {
            this.setState({ page: { ...this.state.page, [key]: event.target.value } });
        };

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.state;
        const { isDisabled, isSending, isError, isSuccess } = this.props;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Page`}>
                <section className="pages">
                    <h1>Pages</h1>
                    <form onSubmit={this.submit.bind(this)}>

                        {isSuccess && (
                            <section className="success">Page has been successfully saved.</section>
                        )}

                        {isError && (
                            <section className="error">There was a problem saving the page.</section>
                        )}

                        <div className="title">
                            <label htmlFor="title">Title:</label>
                            <input type="text" name="title" value={page.title} onChange={this.update('title')} />
                        </div>

                        <div className="content">
                            <label htmlFor="content">Content:</label>
                            <textarea name="content" value={page.content} onChange={this.update('content')} />
                        </div>

                        <button type="submit" disabled={isSending || isDisabled}>
                            {isSending ? 'Saving...' : 'Save'}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

})));
