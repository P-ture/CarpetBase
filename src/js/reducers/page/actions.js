import * as type from './types';

/**
 * @constant HOME
 * @type {String}
 */
export const HOME = 'home';

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
 * @method fetchNavigation
 * @return {Function}
 */
export function fetchNavigation() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('navigation.json');
        return dispatch(({ type: type.FETCH_NAVIGATION, result: data }));
    };

}
