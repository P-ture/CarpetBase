import MockAdapter from 'axios-mock-adapter';
import { create } from 'axios';
import User from '../mocks/user.json';
import Navigation from '../mocks/navigation.json';
import Meta from '../mocks/meta.json';

/**
 * @method setupMocks
 * @return {Object}
 */
export function setupMocks() {

    const instance = create({ baseURL: '/api/' });
    const mock = new MockAdapter(instance);

    mock.onGet('user.json').reply(200, User);
    mock.onGet('navigation.json').reply(200, Navigation);
    mock.onGet('meta.json').reply(200, Meta);

    /**
     * @method dispatch
     * @param {Object} action
     * @return {*}
     */
    const dispatch = action => action.result;

    /**
     * @method getState
     * @return {Object}
     */
    const getState = () => ({ config: { axiosInstance: instance } });

    return { dispatch, getState };

}
