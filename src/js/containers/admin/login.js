import React, { PureComponent } from 'react';

/**
 * @class Login
 * @extends {PureComponent}
 */
export default class Login extends PureComponent {
    
    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Login';

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <main className="login">
                <fieldset>
                    <legend>Login</legend>
                    <form method="post">
                        <div className="username">
                            <label htmlFor="username">Username:</label>
                            <input type="text" name="username" maxLength={64} />
                        </div>
                        <div className="password">
                            <label htmlFor="password">Password:</label>
                            <input type="password" name="password" maxLength={64} />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </fieldset>
            </main>
        );

    }

}
