import React from 'react';
import { hydrate } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Index from './index';
import reducers from './reducers';
import { BrowserRouter, withRouter } from 'react-router-dom';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers, JSON.parse(window.__state__));
const LayoutWithRouter = withRouter(Index);

hydrate((
    <Provider store={store}>
        <BrowserRouter forceRefresh={true}>
            <LayoutWithRouter />
        </BrowserRouter>
    </Provider>
), document.querySelector('.app'));
