import { extname } from 'path';
import { readFile, readFileSync } from 'fs';
import React from 'react';
import { StaticRouter, withRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import DocumentTitle from 'react-document-title';
import { create } from 'axios';
import jwt from 'jsonwebtoken';
import { compile } from 'handlebars';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { compose, flatten, identity, groupBy, filter } from 'ramda';
import App, { Layout } from '../js/index';
import routes from '../js/routes';
import reducers from '../js/reducers';
import Index from '../js/index';

/**
 * @constant options
 * @type {Object}
 */
const options = compose(
    JSON.parse,
    readFileSync
)('package.json');

/**
 * @method isAuthenticated
 * @param {Object} cookies
 * @return {Boolean}
 */
function isAuthenticated(cookies) {

    try {
        return Boolean(jwt.verify(cookies.jwttoken, process.env.CARPETBASE_SECRET));
    } catch (err) {
        return false;
    }

}

/**
 * @method render
 * @param {Object} request
 * @param {Object} response
 * @return {Object}
 */
async function render(request, response) {

    const { url, headers, cookies } = request;
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMiddleware(reducers);
    const LayoutWithRouter = withRouter(Index);
    const transform = compose(groupBy(extname), filter(identity), flatten);
    const instance = create({ baseURL: `http://${headers.host}/api/`, timeout: 1000, headers: request.headers });
    const params = { dispatch: store.dispatch, instance, response };

    try {

        // Await the population of the Redux store before rendering the application tree.
        Index.fetchData && await Index.fetchData(params);

        const assets = await Promise.all(routes.map(async route => {

            const match = matchPath(url, route);
            const { component } = route;

            if (match) {

                // Determine if the user is authenticated, and if not redirect to the login page.
                component && component.requiresAuth === true && !isAuthenticated(cookies) && response.redirect('/admin/login.html');
            
                try {

                    // Fetch any data the current container requires to function.
                    component && component.fetchData && await component.fetchData({ ...params, params: match.params });
                
                } catch (err) {

                }

                // Yield any assets that the component wants to load.
                return component.assets || null;
            
            }

            return null;

        }));

        const html = renderToString((
            <Provider store={store}>
                <StaticRouter context={{}} location={url}>
                    <LayoutWithRouter />
                </StaticRouter>
            </Provider>
        ));

        return { html, state: store.getState(), assets: transform(assets) };

    } catch (err) {

        console.log('Error: ', err);

        const html = renderToString(
            <DocumentTitle title="Error">
                <section className="error">
                    <h1>CarpetBase</h1>
                    <p>We&apos;re currently experiencing difficulties. Please <a href="/">try again</a> later.</p>
                </section>
            </DocumentTitle>
        );

        return { html, state: store.getState(), assets: [] };

    }

}

export default function(request, response) {

    return readFile('public/index.html', 'utf8', async (_, document) => {

        // Render the application to string, and parse the template HTML file.
        const { html, state, assets } = await render(request, response);
        const resources = { css: assets['.css'], js: assets['.js'] };
        const template = compile(document)({ ...options, html, resources, title: DocumentTitle.rewind() });

        return !response.headersSent && response.send(template);

    });

}
