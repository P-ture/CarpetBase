import Page from './containers/page/index';
import * as Admin from './containers/admin/index';
import ErrorNotFound from './containers/error/not-found';

export default [
    { path: '/', exact: true, component: Page },
    { path: '/admin/login.html', component: Admin.Login },
    { path: '/admin/logout.html', component: Admin.Logout },
    { path: '/admin/dashboard.html', component: Admin.Dashboard },
    { path: '/:page.html', component: Page },
    { path: '/', component: ErrorNotFound }
];
