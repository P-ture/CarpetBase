import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import setCookie from 'set-cookie';

/**
 * @method fetchData
 * @param {Object} request
 * @param {Object} response
 * @return {Promise}
 */
export function fetchData({ request, response }) {
    return setCookie('jwttoken', null, { res: response, path: '/' });
}

/**
 * @class Index
 * @extends {PureComponent}
 */
export class Index extends PureComponent {
    
    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Logout';

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <section className="dashboard">
                <p>You have been signed out of your account &mdash; you can <NavLink to="/admin/login.html">sign into another account</NavLink>.</p>
            </section>
        );

    }

}
