import React from 'react';
import { StaticRouter, withRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import format from 'string-template';
import { Provider } from 'react-redux';
import { compose } from 'ramda';
import { readFile, readFileSync } from 'fs';
import App from '../js/index';
import Index from '../js/index';
import reducers from '../js/reducers';
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
 * @constant tree
 * @type {Array}
 */
const tree = [{
    component: Index,
    routes: [
        { path: '/', exact: true, component: Home.Index, action: Home.fetchData },
        { path: '/about.html', component: About.Index, action: About.fetchData }
    ]
}];

/**
 * @method compile
 * @param {String} path
 * @return {string}
 */
async function compile(path) {

    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMiddleware(reducers);
    const LayoutWithRouter = withRouter(Index);

    const branch = matchRoutes(tree, path);
    await branch[1].route.action(store.dispatch);

    return renderToString((
        <Provider store={store}>
            <StaticRouter context={{}} location={path}>
                <LayoutWithRouter />
            </StaticRouter>
        </Provider>
    ));

}

export default function(request, response) {

    return readFile('public/index.html', 'utf8', async (_, document) => {
        const html = format(document, { ...options, jsx: await compile(request.url) });
        return response.send(html);
    });

}
