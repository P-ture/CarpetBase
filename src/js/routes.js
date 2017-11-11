import * as Home from './containers/home/index';
import * as About from './containers/about/index';
import * as AdminDashboard from './containers/admin/dashboard';
import * as AdminLogin from './containers/admin/login';
import * as AdminLogout from './containers/admin/logout';
import * as ErrorNotFound from './containers/error/not-found';

export default [
    { path: '/', exact: true, component: Home.Index, fetch: Home.fetchData },
    { path: '/about.html', component: About.Index, fetch: About.fetchData },
    { path: '/admin/login.html', component: AdminLogin.Index },
    { path: '/admin/logout.html', component: AdminLogout.Index, fetch: AdminLogout.fetchData },
    { path: '/admin/dashboard.html', component: AdminDashboard.Index },
    { path: '/', component: ErrorNotFound.Index }
];
