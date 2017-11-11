import instance from '../../request';
import * as type from './types';

/**
 * @method fetchPage
 * @param {String} slug
 * @return {Function}
 */
export function fetchPage(slug) {

    return async dispatch => {
        const { data } = await instance.get(`page/${slug}.json`);
        return dispatch(({ type: type.FETCH_PAGE, result: data }));
    };

}
