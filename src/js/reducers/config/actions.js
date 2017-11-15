import * as type from './types';

/**
 * @method setAxiosInstance
 * @param {Object} instance
 * @return {Function}
 */
export function setAxiosInstance(instance) {
    return { type: type.SET_AXIOS_INSTANCE, result: instance };
}
