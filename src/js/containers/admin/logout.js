import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import setCookie from 'set-cookie';
import DocumentTitle from 'react-document-title';
import * as config from '../../miscellaneous/config';

/**
 * @class Logout
 * @extends {PureComponent}
 */
export default class Logout extends PureComponent {

    /**
     * @constant displayName
     * @type {String}
     */
    static displayName = 'Authenticate/Index/Logout';

    /**
     * @method fetchData
     * @param {Object} response
     * @return {Promise}
     */
    static fetchData = ({ response }) => {
        return setCookie('jwttoken', null, { res: response, path: '/', expires: new Date() });
    };

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
