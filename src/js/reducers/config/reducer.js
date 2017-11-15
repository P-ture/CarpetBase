import * as type from './types';

/**
 * @constant INITIAL_STATE
 * @type {Object}
 */
const INITIAL_STATE = {
    axiosInstance: null,
    meta: {}
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case type.SET_AXIOS_INSTANCE:
            return { ...state, axiosInstance: action.result };

        case type.FETCH_META:
            return { ...state, meta: action.result };

    }

    return state;

};
