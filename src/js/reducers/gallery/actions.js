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

/**
 * @method fetchGalleries
 * @return {Function}
 */
export function fetchGalleries() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('galleries.json');
        return dispatch(({ type: type.FETCH_GALLERIES, result: data }));
    };

}

/**
 * @method fetchGalleries
 * @param {Number} galleryId
 * @return {Function}
 */
export function fetchMedia(galleryId) {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get(`gallery/${galleryId}.json`);
        return dispatch(({ type: type.FETCH_MEDIA, result: { galleryId, data } }));
    };

}
