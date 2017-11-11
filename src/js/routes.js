import * as Home from './containers/home/index';
import * as About from './containers/about/index';
import * as Admin from './containers/admin/index';

export default [
    { path: '/', exact: true, component: Home.Index, actions: Home.fetchData },
    { path: '/about.html', component: About.Index, actions: About.fetchData },
    { path: '/admin/login.html', component: Admin.Login }
];
