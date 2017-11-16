import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import { Layout } from '../../src/js/miscellaneous/layout';
import { setupMocks } from '../helpers/mocks';
import * as authActions from '../../src/js/reducers/auth/actions';
import * as configActions from '../../src/js/reducers/config/actions';
import * as pageActions from '../../src/js/reducers/page/actions';

test.beforeEach(async t => {

    const { dispatch, getState } = setupMocks();

    const user = await authActions.fetchUser()(dispatch, getState);
    const navigation = await pageActions.fetchNavigation()(dispatch, getState);
    const meta = await configActions.fetchMeta()(dispatch, getState);

    t.context.props = { user, navigation, meta };

});

test('It should be able to render the layout with the dynamic parts;', t => {
    const wrapper = shallow(<Layout {...t.context.props} />);
    t.is(wrapper.find('h4').text(), 'Slogan is now coming from the API');
});
