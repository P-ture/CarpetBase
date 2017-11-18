import { extname } from 'path';
import { readFile, readFileSync } from 'fs';
import React from 'react';
import base64 from 'base-64';
import { StaticRouter, withRouter, matchPath } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { renderToString } from 'react-dom/server';
import jwt from 'jsonwebtoken';
import { compile } from 'handlebars';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { compose, flatten, identity, groupBy, filter } from 'ramda';
import routes from '../js/miscellaneous/routes';
import * as Layout from '../js/miscellaneous/layout';
import { isAuthenticated } from './api/auth';
import createServer from '../js/server';
import createError from '../js/error';

/**
 * @constant options
 * @type {Object}
 */
const options = compose(JSON.parse, readFileSync)('package.json');

/**
 * @method render
 * @param {Object} request
 * @param {Object} response
 * @return {Object}
 */
async function render(request, response) {

    const { url, headers, cookies, body } = request;
    const { jsx, store } = createServer(request);

    // Create the Axios instance, and setup the params for passing into each `fetch` function.
    const params = { dispatch: store.dispatch, response };

    try {

        // Await the population of the Redux store before rendering the application tree.
        Layout.fetch && await Layout.fetch(params);

        // Iterate over each route to fetch data, check authentication, and optionally yield a list of
        // page-related CSS documents to append to the served HTML.
        const css = await Promise.all(routes.map(async route => {

            const match = matchPath(url, route);
            const { component, fetch, auth, css } = route;

            if (match) {

                // Determine if the user is authenticated, and if not redirect to the login page.
                component && auth === true && !isAuthenticated(cookies) && response.redirect('/admin/login.html');
            
                try {

                    // Fetch any data the current container requires to function.
                    component && fetch && await fetch({ ...params, params: match.params });
                
                } catch (err) {

                }

                // Yield any CSS documents that the component wants to load.
                return css || null;
            
            }

            return null;

        }));

        return { html: renderToString(jsx), state: store.getState(), css: css.filter(identity) };

    } catch (err) {

        return { html: renderToString(createError()), state: store.getState(), css: [] };

    }

}

export default function(request, response) {

    return readFile('public/index.html', 'utf8', async (_, document) => {

        // Render the application to string, and parse the template HTML file.
        const { html, state, css } = await render(request, response);
        const title = DocumentTitle.rewind();
        const template = compile(document)({ ...options, html, css, title, state: base64.encode(JSON.stringify(state)) });

        return !response.headersSent && response.send(template);

    });

}
