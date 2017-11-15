import React from 'react';
import { hydrate } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, withRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { create } from 'axios';
import reducers from './miscellaneous/reducers';
import Layout from './miscellaneous/layout';
import * as config from './miscellaneous/config';
import { setAxiosInstance } from './reducers/config/actions';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
console.log(window[Symbol.for('state')]);
const store = createStoreWithMiddleware(reducers, JSON.parse(window[Symbol.for('state')]));
const LayoutWithRouter = withRouter(Layout);

const instance = create({
    baseURL: `/api/`,
    timeout: config.REQUEST_TIMEOUT
});

// Setup the Axios instance and pass it into the Redux store.
store.dispatch(setAxiosInstance(instance));

hydrate((
    <Provider store={store}>
        <BrowserRouter forceRefresh>
            <LayoutWithRouter />
        </BrowserRouter>
    </Provider>
), document.querySelector('.container'));
