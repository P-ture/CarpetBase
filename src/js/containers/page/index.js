import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import DocumentTitle from 'react-document-title';
import * as actions from '../../reducers/page/actions';
import * as config from '../../miscellaneous/config';
import NotFound from '../error/not-found';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
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
 * @param {Object} instance
 * @param {Object} params
 * @return {Promise}
 */
export const fetch = ({ dispatch, params }) => {
    return dispatch(actions.fetchPage(params.page || actions.HOME));
};

/**
 * @class Page
 * @extends {PureComponent}
 */
export default connect(mapStateToProps, mapDispatchToProps)(class Page extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Page/Index';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        page: PropTypes.object
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        page: null
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.props;

        return page ? (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} ${page.title}`}>
                <section className={`page ${page.slug}`}>
                    <h1>{page.title}</h1>
                    <Markdown source={page.content} />
                </section>
            </DocumentTitle>
        ) : <NotFound />;

    }

});
