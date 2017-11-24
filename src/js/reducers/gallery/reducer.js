import * as type from './types';

/**
 * @constant INITIAL_STATE
 * @type {Object}
 */
const INITIAL_STATE = {
    model: null,
    list: [],
    media: {}
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case type.FETCH_GALLERY:
            return { ...state, model: action.result };

        case type.FETCH_GALLERIES:
            return { ...state, list: action.result };

        case type.FETCH_MEDIA:
            return { ...state, media: { ...state.media, [action.result.galleryId]: action.result.data } };

    }

    return state;

};
