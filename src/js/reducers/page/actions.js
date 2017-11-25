import * as type from './types';

/**
 * @constant HOME
 * @type {String}
 */
export const HOME = 'homepage';

/**
 * @method fetchPage
 * @param {String} slug
 * @return {Function}
 */
export function fetchPage(slug) {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get(`page/${slug}.json`);
        return dispatch(({ type: type.FETCH_PAGE, result: data }));
    };

}

/**
 * @method fetchPages
 * @return {Function}
 */
export function fetchPages() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('pages.json');
        return dispatch(({ type: type.FETCH_PAGES, result: data }));
    };

}

/**
 * @method fetchLayouts
 * @return {Function}
 */
export function fetchLayouts() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('layouts.json');
        return dispatch(({ type: type.FETCH_LAYOUTS, result: data }));
    };

}
