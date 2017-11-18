import * as Page from '../containers/page/index';
import * as Contact from '../containers/contact/index';
import * as AdminDashboard from '../containers/admin/dashboard';
import * as AdminMeta from '../containers/admin/meta';
import * as AdminPages from '../containers/admin/pages';
import * as AdminPage from '../containers/admin/page';
import * as AdminLogin from '../containers/admin/login';
import * as AdminLogout from '../containers/admin/logout';
import * as ErrorNotFound from '../containers/error/not-found';

export default [
    {
        path: '/',
        exact: true,
        component: Page.default,
        auth: false,
        fetch: Page.fetch
    },
    {
        path: '/admin/login.html',
        component: AdminLogin.default,
        auth: true
    },
    {
        path: '/admin/logout.html',
        component: AdminLogout.default,
        auth: true,
        fetch: AdminLogout.fetch
    },
    {
        path: '/admin/dashboard.html',
        component: AdminDashboard.default,
        auth: true
    },
    {
        path: '/admin/meta.html',
        component: AdminMeta.default,
        auth: true,
        fetch: AdminMeta.fetch
    },
    {
        path: '/admin/pages.html',
        component: AdminPages.default,
        auth: true,
        fetch: AdminPages.fetch
    },
    {
        path: '/admin/page/:page.html',
        component: AdminPage.default,
        auth: true,
        fetch: AdminPage.fetch
    },
    {
        path: '/contact.html',
        component: Contact.default,
        auth: false,
        fetch: Contact.fetch,
        css: ['/css/contact.css']
    },
    {
        path: '/:page.html',
        component: Page.default,
        auth: false,
        fetch: Page.fetch
    },
    {
        path: '/',
        component: ErrorNotFound.default,
        auth: false
    }
];
