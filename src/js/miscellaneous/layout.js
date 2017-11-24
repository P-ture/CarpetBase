import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Markdown from 'react-markdown';
import hash from 'object-hash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import by from 'sort-by';
import * as authActions from '../reducers/auth/actions';
import * as pageActions from '../reducers/page/actions';
import * as configActions from '../reducers/config/actions';
import Modal from '../containers/components/modal/index';
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
export class Layout extends Component {

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
     * @constant state
     * @type {Object}
     */
    state = {
        user: {},
        telephoneModal: false,
        emailModal: false
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {

        const { user, meta, navigation } = this.props;
        const { telephoneModal, emailModal } = this.state;

        return (
            <section className="carpetbase">
                <header>
                    <section className="top">
                        <a href="/">
                            <h1>Carpet Base</h1>
                        </a>
                        <section className="header-contact">
                            <Modal
                                className="telephone-modal"
                                title="Telephone"
                                btnClass="telephone"
                                Open={telephoneModal === true}
                                onOpen={() => this.setState({ telephoneModal: true })}
                                onClose={() => this.setState({ telephoneModal: false })}
                                >
                                <p>{meta.telephone}</p>
                            </Modal>

                            <Modal
                                className="email-modal"
                                title="Email"
                                btnClass="email"
                                Open={emailModal === true}
                                onOpen={() => this.setState({ emailModal: true })}
                                onClose={() => this.setState({ emailModal: false })}
                                >
                                <a href={`mailto:${meta.email}?subject=Carpet Base Enquiry`}>{meta.email}</a>
                            </Modal>
                        </section>
                    </section>

                    {meta.slogan && <section className="bottom"><h4>{meta.slogan}</h4></section>}

                </header>

                <nav className="navigation">
                    <ul>
                        {[...navigation].sort(by('order')).map((model, index) => {

                            return (
                                <li key={hash(model)}>
                                    <a href={model.href}>
                                        {model.name}
                                    </a>
                                    {index === 0 || index === navigation.length - 1 ? '' : <span key={hash(index)}>-</span>}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <nav className="subnavigation">

                    {user.authenticated && [
                        <span key="username" className="username">
                            You&apos;re signed in as <em>{user.username}</em>
                        </span>,
                        <a key="dashboard" href="/admin/dashboard.html">Dashboard</a>,
                        <a key="meta" href="/admin/meta.html">Meta</a>,
                        <a key="pages" href="/admin/pages.html">Pages</a>,
                        <a key="galleries" href="/admin/galleries.html">Galleries</a>,
                        <a key="logout" href="/admin/logout.html">Sign Out</a>
                    ]}

                    {!user.authenticated && <a href="/admin/login.html">Sign In</a>}

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
                            Email: <a href={`mailto:${meta.email}?subject=Carpet Base Enquiry`}>{meta.email}</a>
                        </li>
                        <li>CarpetBase {new Date().getFullYear()}</li>
                        <li>Structured by <a href="https://www.pture.com/">Pture</a></li>
                    </ul>

                    {meta.social && <Markdown source={meta.social} />}
                </footer>

            </section>
        );

    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
