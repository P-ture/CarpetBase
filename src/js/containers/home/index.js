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
 * @class Index
 * @extends {PureComponent}
 */
export default connect(mapStateToProps, mapDispatchToProps)(class Home extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Home/Index';

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
     * @return {Promise}
     */
    static fetchData = ({ dispatch, instance }) => {
        return dispatch(actions.fetchPage('home', { instance }));
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section className="home">
                <h1>{this.props.page.title}</h1>
            </section>
        );

    }

});
