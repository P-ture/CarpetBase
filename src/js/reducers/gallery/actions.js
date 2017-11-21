import * as type from './types';

/**
 * @method fetchGallery
 * @param {String} slug
 * @return {Function}
 */
export function fetchGallery(slug) {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get(`gallery/${slug}.json`);
        return dispatch(({ type: type.FETCH_GALLERY, result: data }));
    };

}
