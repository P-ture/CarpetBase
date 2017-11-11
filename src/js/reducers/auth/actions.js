import { request } from 'axios';
import instance from '../../request';
import * as type from './types';

/**
 * @method fetchUser
 * @param {Object} headers
 * @return {Function}
 */
export function fetchUser({ headers }) {

    return async dispatch => {
        const { data } = await instance.request({ url: 'user.json', method: 'GET', headers });
        return dispatch(({ type: type.FETCH_USER, result: data }));
    };

}
