import { combineReducers } from 'redux';
import page from './reducers/page/reducer';
import auth from './reducers/auth/reducer';

export default combineReducers({
    page,
    auth
});
