import * as type from './types';

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
