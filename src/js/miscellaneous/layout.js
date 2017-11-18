import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, NavLink } from 'react-router-dom';
import Markdown from 'react-markdown';
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
 * @method fetch
 * @param {Function} dispatch
 * @return {Promise}
 */
export const fetch = ({ dispatch }) => {

    return Promise.all([
        dispatch(actions.fetchUser()),
        dispatch(actions.fetchNavigation()),
        dispatch(actions.fetchMeta())
    ]);

};

/**
 * @class Layout
 * @extends {PureComponent}
 */
export class Layout extends PureComponent {

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
            slogan: PropTypes.string,
            social: PropTypes.string,
            address: PropTypes.string,
            email: PropTypes.string,
            telephone: PropTypes.string
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
                    {meta.slogan && <section className="bottom"><h4>{meta.slogan}</h4></section>}
                    {meta.social && <Markdown source={meta.social} />}
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
                        <NavLink key="meta" to="/admin/meta.html">Meta</NavLink>,
                        <NavLink key="pages" to="/admin/pages.html">Pages</NavLink>,
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

                <footer>
                    <ul>
                        <li className="address">
                            Address: {meta.address}
                        </li>
                        <li className="phone">
                            Phone: <a href={`tel:${meta.telephone.replace(/\s/g, '')}`}>{meta.telephone}</a>
                        </li>
                        <li className="email">
                            Email: <a href={`mailto:${meta.email}`}>{meta.email}</a>
                        </li>
                        <li>CarpetBase {new Date().getFullYear()}</li>
                        <li>Structured by <a href="https://www.pture.com/">Pture</a></li>
                    </ul>
                </footer>

            </section>
        );

    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
