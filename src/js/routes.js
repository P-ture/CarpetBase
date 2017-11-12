import Home from './containers/home/index';
import About from './containers/about/index';
import * as Admin from './containers/admin/index';
import ErrorNotFound from './containers/error/not-found';

export default [
    { path: '/', exact: true, component: Home },
    { path: '/about.html', component: About },
    { path: '/admin/login.html', component: Admin.Login },
    { path: '/admin/logout.html', component: Admin.Logout },
    { path: '/admin/dashboard.html', component: Admin.Dashboard },
    { path: '/', component: ErrorNotFound }
];
