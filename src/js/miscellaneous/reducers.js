import { combineReducers } from 'redux';
import page from '../reducers/page/reducer';
import auth from '../reducers/auth/reducer';
import config from '../reducers/config/reducer';
import gallery from '../reducers/gallery//reducer';

export default combineReducers({
    page,
    auth,
    config,
    gallery
});
