import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, NavLink } from 'react-router-dom';
import hash from 'object-hash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './reducers/auth/actions';
import routes from './routes';

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        user: state.auth.user
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
 * @class Layout
 * @extends {PureComponent}
 */
export default connect(mapStateToProps, mapDispatchToProps)(class Layout extends PureComponent {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        user: PropTypes.shape({
            authenticated: PropTypes.bool.isRequired,
            username: PropTypes.string
        })
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        user: {}
    };

    /**
     * @method fetchData
     * @param {Function} dispatch
     * @param {Object} headers
     * @return {Promise}
     */
    static fetchData = ({ dispatch, instance }) => {
        return dispatch(actions.fetchUser({ instance }));
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {

        const { user } = this.props;

        return (
            <section className="carpetbase">

                <header>CarpetBase</header>

                <nav className="navigation">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about.html">About</NavLink>
                    {!user.authenticated && <NavLink to="/admin/login.html">Sign In</NavLink>}
                </nav>

                {user.authenticated && (
                    <nav className="subnavigation">
                        <span className="username">You&apos;re signed in as <em>{user.username}</em></span>
                        <NavLink to="/admin/dashboard.html">Dashboard</NavLink>
                        <NavLink to="/admin/logout.html">Sign Out</NavLink>
                    </nav>
                )}

                <main>
                    <Switch>
                        {routes.map(route => {
                            return <Route key={hash(route)} {...route} />;
                        })}
                    </Switch>
                </main>

                <footer />

            </section>
        );

    }

});
