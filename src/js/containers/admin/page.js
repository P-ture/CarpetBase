import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import hash from 'object-hash';
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
        page: state.page.content,
        layouts: state.page.layouts
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

    return Promise.all([
        dispatch(actions.fetchLayouts()),
        dispatch(actions.fetchPage(params.page || actions.HOME))
    ]);

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
        layouts: PropTypes.array.isRequired,
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
            const isNumber = /^[0-9]$/.test(event.target.value);
            const value = isNumber ? Number(event.target.value) : event.target.value;
            this.setState({ page: { ...this.state.page, [key]: value } });
        };

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.state;
        const { layouts, isDisabled, isSending, isError, isSuccess } = this.props;

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

                        <ul className="layout">

                            {layouts.map((layout, index) => {

                                const id = `layout-${index}`;

                                return (
                                    <li key={hash(layout)}>
                                        <label htmlFor={id}>{layout.name}</label>
                                        <input
                                            type="radio"
                                            name={id}
                                            value={layout.id}
                                            checked={layout.id === page.layoutId}
                                            onChange={this.update('layoutId')}
                                            />
                                    </li>
                                );

                            })}

                        </ul>

                        <button type="submit" disabled={isSending || isDisabled}>
                            {isSending ? 'Saving...' : 'Save'}
                        </button>

                    </form>
                </section>
            </DocumentTitle>
        );

    }

})));
