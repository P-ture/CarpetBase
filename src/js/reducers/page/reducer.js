import * as type from './types';

/**
 * @constant INITIAL_STATE
 * @type {Object}
 */
const INITIAL_STATE = {
    list: [],
    content: null,
    layouts: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case type.FETCH_PAGE:
            return { ...state, content: action.result };

        case type.FETCH_PAGES:
            return { ...state, list: action.result };

        case type.FETCH_LAYOUTS:
            return { ...state, layouts: action.result };

    }

    return state;

};
