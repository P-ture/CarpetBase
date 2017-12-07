import * as Page from '../containers/page/index';
import * as Contact from '../containers/contact/index';
import * as AdminDashboard from '../containers/admin/dashboard';
import * as AdminMeta from '../containers/admin/meta';
import * as AdminPages from '../containers/admin/pages';
import * as AdminPage from '../containers/admin/page';
import * as AdminGalleries from '../containers/admin/galleries';
import * as AdminGallery from '../containers/admin/gallery';
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
        auth: false,
        css: ['/css/admin-login.css']
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
        fetch: AdminMeta.fetch,
        css: ['/css/admin-meta.css']
    },
    {
        path: '/admin/pages.html',
        component: AdminPages.default,
        auth: true,
        fetch: AdminPages.fetch,
        css: ['/css/admin-pages.css']
    },
    {
        path: '/admin/page/:id.html',
        component: AdminPage.default,
        auth: true,
        fetch: AdminPage.fetch,
        css: ['/css/admin-page.css']
    },
    {
        path: '/admin/galleries.html',
        component: AdminGalleries.default,
        auth: true,
        fetch: AdminGalleries.fetch,
        css: ['/css/admin-galleries.css']
    },
    {
        path: '/admin/gallery/:id.html',
        component: AdminGallery.default,
        auth: true,
        fetch: AdminGallery.fetch,
        css: ['/css/admin-gallery.css']
    },
    {
        path: '/contact.html',
        component: Contact.default,
        auth: false,
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
