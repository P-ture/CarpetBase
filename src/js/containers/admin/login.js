import React, { Component } from 'react';
import { post } from 'axios';
import { withRouter } from 'react-router-dom';

/**
 * @class Login
 * @extends {Component}
 */
class Login extends Component {
    
    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Login';

    /**
     * @constant state
     * @type {Object}
     */
    state = {
        username: '',
        password: '',
        errors: null
    };

    /**
     * @method update
     * @param {String} field
     * @return {Function}
     */
    update(field) {
        return event => this.setState({ [field]: event.target.value });
    }

    /**
     * @method authenticate
     * @param {String} username
     * @param {String} password
     * @return {Promise}
     */
    async authenticate(username, password) {

        this.setState({ error: null });

        const error = 'Incorrect username and/or password.';
        const data = { username, password };
        const { data: { authenticated, token } } = await post('/api/authenticate.json', data, {
            withCredentials: true
        });

        return authenticated ? this.props.history.push('/admin/dashboard.html') : this.setState({ error });

    }

    /**
     * @method render
     * @return {Object}
     */
    render() {

        const { username, password, error } = this.state;

        return (
            <section className="login">
                <fieldset>
                    <legend>Login</legend>
                    {error && <section className="error">{error}</section>}
                    <form method="post" onSubmit={event => event.preventDefault(void this.authenticate(username, password))}>
                        <div className="username">
                            <label htmlFor="username">Username:</label>
                            <input type="text" name="username" onChange={this.update('username')} />
                        </div>
                        <div className="password">
                            <label htmlFor="password">Password:</label>
                            <input type="text" name="password" onChange={this.update('password')} />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </fieldset>
            </section>
        );

    }

}

export const Index = withRouter(Login);
