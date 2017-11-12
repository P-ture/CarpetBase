import React, { PureComponent } from 'react';

/**
 * @class Dashboard
 * @extends {PureComponent}
 */
export default class Dashboard extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Dashboard';

    /**
     * @constant requiresAuth
     * @type {Boolean}
     */
    static requiresAuth = true;

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section className="dashboard">
                <h1>Dashboard</h1>
            </section>
        );

    }

}
