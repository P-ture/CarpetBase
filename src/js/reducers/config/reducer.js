import * as type from './types';

/**
 * @constant INITIAL_STATE
 * @type {Object}
 */
const INITIAL_STATE = {
    axiosInstance: null
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case type.SET_AXIOS_INSTANCE:
            return { ...state, axiosInstance: action.result };

    }

    return state;

};
