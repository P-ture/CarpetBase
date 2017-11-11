import React from 'react';
import { StaticRouter, withRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import format from 'string-template';
import { compose } from 'ramda';
import { readFile, readFileSync } from 'fs';
import App, { Layout } from '../js/index';
import routes from '../js/routes';
import reducers from '../js/reducers';
import * as Index from '../js/index';
import * as Home from '../js/containers/home/index';
import * as About from '../js/containers/about/index';

/**
 * @constant options
 * @type {Object}
 */
const options = compose(
    JSON.parse,
    readFileSync
)('package.json');

/**
 * @method compile
 * @param {Object} request
 * @param {Object} response
 * @return {Object}
 */
async function compile(request, response) {

    const { path, headers } = request;
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMiddleware(reducers);
    const LayoutWithRouter = withRouter(Index.Layout);
    const params = { dispatch: store.dispatch, headers, request, response };
    
    // Await the population of the Redux store before rendering the application tree.
    Index.fetchData && await Index.fetchData(params);
    await Promise.all(routes.map(async route => {
        const match = matchPath(path, route);
        return (match && route.fetch) ? await route.fetch(params) : Promise.resolve();
    }));

    const html = renderToString((
        <Provider store={store}>
            <StaticRouter context={{}} location={path}>
                <LayoutWithRouter />
            </StaticRouter>
        </Provider>
    ));

    return { html, state: store.getState() };

}

export default function(request, response) {

    return readFile('public/index.html', 'utf8', async (_, document) => {

        // Render the application to string, and parse the template HTML file.
        const { html, state } = await compile(request, response);
        const dom = format(document, { ...options, html });
        
        // Append the data taken from the Redux store and append it to the <body /> tag.
        const jsDom = new JSDOM(dom);
        const script = jsDom.window.document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'UTF-8');
        script.innerHTML = `window.__state__ = '${JSON.stringify(state)}';`;
        jsDom.window.document.body.appendChild(script);

        return response.send(jsDom.serialize());
    });

}
