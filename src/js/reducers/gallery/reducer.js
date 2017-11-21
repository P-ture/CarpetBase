import * as type from './types';

/**
 * @constant INITIAL_STATE
 * @type {Object}
 */
const INITIAL_STATE = {
    content: null
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case type.FETCH_GALLERY:
            return { ...state, content: action.result };

    }

    return state;

};
