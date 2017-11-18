import * as Page from '../containers/page/index';
import * as Contact from '../containers/contact/index';
import * as Dashboard from '../containers/admin/dashboard';
import * as Meta from '../containers/admin/meta';
import * as Pages from '../containers/admin/pages';
import * as Login from '../containers/admin/login';
import * as Logout from '../containers/admin/logout';
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
        component: Login.default,
        auth: true
    },
    {
        path: '/admin/logout.html',
        component: Logout.default,
        auth: true,
        fetch: Logout.fetch
    },
    {
        path: '/admin/dashboard.html',
        component: Dashboard.default,
        auth: true
    },
    {
        path: '/admin/meta.html',
        component: Meta.default,
        auth: true,
        fetch: Meta.fetch
    },
    {
        path: '/admin/pages.html',
        component: Pages.default,
        auth: true,
        fetch: Pages.fetch
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
