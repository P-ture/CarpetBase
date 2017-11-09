import { get } from 'axios';
import * as type from './types';
import { URL } from '../../config';

/**
 * @method fetchPage
 * @param {String} slug
 * @return {Function}
 */
export function fetchPage(slug) {

    return async dispatch => {
        const { data } = await get(`${URL}/api/page/${slug}.json`);
        return dispatch(({ type: type.FETCH_PAGE, result: data }));
    };

}
