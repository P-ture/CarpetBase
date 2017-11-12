import * as type from './types';

/**
 * @method fetchUser
 * @param {Object} instance
 * @return {Function}
 */
export function fetchUser({ instance }) {

    return async dispatch => {
        const { data } = await instance.get('user.json');
        return dispatch(({ type: type.FETCH_USER, result: data }));
    };

}
