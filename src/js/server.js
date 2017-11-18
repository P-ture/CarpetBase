import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { StaticRouter, withRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { create } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import reducers from './miscellaneous/reducers';
import Layout from './miscellaneous/layout';
import * as config from './miscellaneous/config';
import { setAxiosInstance } from './reducers/config/actions';

/**
 * @method createServer
 * @param {Object} request
 * @return {Object}
 */
export default function createServer(request) {

    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMiddleware(reducers);
    const LayoutWithRouter = withRouter(Layout);

    const instance = create({
        baseURL: `http://${request.headers.host}/api/`,
        timeout: config.REQUEST_TIMEOUT,
        headers: { ...request.headers, 'Content-Type': 'application/json' },
        transformRequest: [decamelizeKeys, JSON.stringify],
        transformResponse: [JSON.parse, camelizeKeys]
    });

    // Setup the Axios instance and pass it into the Redux store.
    store.dispatch(setAxiosInstance(instance));

    return { store, jsx: (
        <Provider store={store}>
            <StaticRouter context={{}} location={request.url}>
                <LayoutWithRouter />
            </StaticRouter>
        </Provider>
    ) };

}
