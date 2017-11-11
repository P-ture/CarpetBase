import { request } from 'axios';
import * as type from './types';
import { URL } from '../../config';

/**
 * @method fetchUser
 * @param {Object} headers
 * @return {Function}
 */
export function fetchUser({ headers }) {

    return async dispatch => {

        const { data } = await request({
            url: `${URL}/api/user.json`,
            method: 'GET',
            timeout: 10000,
            headers
        });

        return dispatch(({ type: type.FETCH_USER, result: data }));
    };

}
