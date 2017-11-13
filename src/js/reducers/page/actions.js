import * as type from './types';

/**
 * @constant HOME
 * @type {String}
 */
export const HOME = 'home';

/**
 * @method fetchPage
 * @param {String} slug
 * @param {Object} instance
 * @return {Function}
 */
export function fetchPage(slug, { instance }) {

    return async dispatch => {
        const { data } = await instance.get(`page/${slug}.json`);
        return dispatch(({ type: type.FETCH_PAGE, result: data }));
    };

}

/**
 * @method fetchNavigation
 * @param {Object} instance
 * @return {Function}
 */
export function fetchNavigation({ instance }) {

    return async dispatch => {
        const { data } = await instance.get('navigation.json');
        return dispatch(({ type: type.FETCH_NAVIGATION, result: data }));
    };

}
