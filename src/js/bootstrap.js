import React from 'react';
import { hydrate } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, withRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { Layout } from './index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers, JSON.parse(window.__state__));
const LayoutWithRouter = withRouter(Layout);

hydrate((
    <Provider store={store}>
        <BrowserRouter forceRefresh>
            <LayoutWithRouter />
        </BrowserRouter>
    </Provider>
), document.querySelector('.app'));
