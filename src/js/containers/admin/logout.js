import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import setCookie from 'set-cookie';
import DocumentTitle from 'react-document-title';
import * as config from '../../miscellaneous/config';

/**
 * @method fetch
 * @param {Object} response
 * @return {Promise}
 */
export const fetch = ({ response }) => {
    return setCookie('jwttoken', null, { res: response, path: '/', expires: new Date() });
};

/**
 * @class Logout
 * @extends {PureComponent}
 */
export default class Logout extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Admin/Logout';

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return (
            <DocumentTitle title={`${config.DOCUMENT_TITLE_PREPEND} Administrator: Logout`}>
                <section className="dashboard">
                    <p>You have been signed out of your account &mdash; you can <NavLink to="/admin/login.html">sign into another account</NavLink>.</p>
                </section>
            </DocumentTitle>
        );

    }

}
