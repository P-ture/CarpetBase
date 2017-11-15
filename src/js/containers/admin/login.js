import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import * as config from '../../miscellaneous/config';

/**
 * @constant isInvalid
 * @type {String}
 */
const isInvalid = '?error=invalid';

/**
 * @class Login
 * @extends {Component}
 */
export default withRouter(class Login extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Login';

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        location: PropTypes.shape({
            search: PropTypes.string.isRequired
        }).isRequired
    };

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const isError = this.props.location.search === isInvalid;

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Login`}>
                <section className="login">
                    <fieldset>
                        <legend>Login</legend>
                        {isError && <section className="error">Incorrect username and/or password.</section>}
                        <form method="post" encType="application/x-www-form-urlencoded">
                            <div className="username">
                                <label htmlFor="username">Username:</label>
                                <input type="text" name="username" />
                            </div>
                            <div className="password">
                                <label htmlFor="password">Password:</label>
                                <input type="password" name="password" />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </fieldset>
                </section>
            </DocumentTitle>
        );

    }

});
