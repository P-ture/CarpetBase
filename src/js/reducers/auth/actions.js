import * as type from './types';

/**
 * @method fetchUser
 * @return {Function}
 */
export function fetchUser() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('user.json');
        return dispatch(({ type: type.FETCH_USER, result: data }));
    };

}
