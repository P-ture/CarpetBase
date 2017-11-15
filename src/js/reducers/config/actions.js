import * as type from './types';

/**
 * @method setAxiosInstance
 * @param {Object} instance
 * @return {Object}
 */
export function setAxiosInstance(instance) {
    return { type: type.SET_AXIOS_INSTANCE, result: instance };
}

/**
 * @method fetchMeta
 * @return {Function}
 */
export function fetchMeta() {

    return async (dispatch, getState) => {
        const instance = getState().config.axiosInstance;
        const { data } = await instance.get('meta.json');
        return dispatch(({ type: type.FETCH_META, result: data }));
    };

}
