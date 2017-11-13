import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../reducers/page/actions';

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
        page: PropTypes.object.isRequired
    };

    /**
     * @method fetchData
     * @param {Function} dispatch
     * @param {Object} instance
     * @param {Object} params
     * @return {Promise}
     */
    static fetchData = ({ dispatch, instance, params }) => {
        return dispatch(actions.fetchPage(params.page || actions.HOME, { instance }));
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { page } = this.props;

        return (
            <section className={`page ${page.slug || actions.HOME}`}>
                <h1>{page.title}</h1>
                <p>{page.content}</p>
            </section>
        );

    }

});
