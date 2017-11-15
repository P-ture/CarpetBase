import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, NavLink } from 'react-router-dom';
import hash from 'object-hash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import by from 'sort-by';
import * as authActions from '../reducers/auth/actions';
import * as pageActions from '../reducers/page/actions';
import * as configActions from '../reducers/config/actions';
import routes from './routes';

/**
 * @constant actions
 * @type {Object}
 */
const actions = { ...authActions, ...pageActions, ...configActions };

/**
 * @method mapStateToProps
 * @param {Object} state
 * @return {Object}
 */
export const mapStateToProps = state => {

    return {
        user: state.auth.user,
        navigation: state.page.navigation,
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
        }),
        navigation: PropTypes.array.isRequired,
        meta: PropTypes.shape({
            slogan: PropTypes.string
        }).isRequired
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
    static fetchData = ({ dispatch }) => {

        return Promise.all([
            dispatch(actions.fetchUser()),
            dispatch(actions.fetchNavigation()),
            dispatch(actions.fetchMeta())
        ]);

    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {

        const { user, meta, navigation } = this.props;

        return (
            <section className="carpetbase">
                <header>
                    <section className="top">
                        <NavLink to="/">
                            <h1>Carpet Base</h1>
                        </NavLink>
                        <section className="header-contact">
                            <section className="phone"/>
                            <section className="email"/>
                        </section>
                    </section>
                    <section className="bottom">
                        <h4>{meta.slogan}</h4>
                    </section>
                </header>

                <nav className="navigation">

                    {[...navigation].sort(by('order')).map(model => {
                        return <NavLink key={hash(model)} to={model.href}>{model.name}</NavLink>;
                    })}

                </nav>

                <nav className="subnavigation">

                    {user.authenticated && [
                        <span key="username" className="username">
                            You&apos;re signed in as <em>{user.username}</em>
                        </span>,
                        <NavLink key="dashboard" to="/admin/dashboard.html">Dashboard</NavLink>,
                        <NavLink key="logout" to="/admin/logout.html">Sign Out</NavLink>
                    ]}

                    {!user.authenticated && <NavLink to="/admin/login.html">Sign In</NavLink>}

                </nav>

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
