import { create } from 'axios';
import { URL } from './config';

export default create({
    baseURL: `${URL}/api/`,
    timeout: 1000
});
