import http from 'http';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { composeP } from 'ramda';
import renderApplication from './universal';
import { login, fetchUser, authenticate, authenticated } from './api/auth';
import { fetchPage, fetchPages, updatePage, fetchLayouts } from './api/page';
import * as navigation from './api/navigation';
import * as meta from './api/meta';
import * as mail from './api/mail';
import * as gallery from './api/gallery';

const app = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);

app.get(/[/|.*\.html]$/, renderApplication);
app.post('/admin/login.html', authenticate);
app.get('/api/user.json', fetchUser);
app.get('/api/page/:slug.json', fetchPage);
app.put('/api/page/:slug.json', authenticated(updatePage));
app.get('/api/pages.json', fetchPages);
app.get('/api/navigation.json', navigation.get);
app.get('/api/layouts.json', authenticated(fetchLayouts));
app.get('/api/meta.json', meta.get);
app.put('/api/meta.json', authenticated(meta.update));
app.post('/api/mail.json', mail.send);
app.get('/api/gallery/:slug.json', authenticated(gallery.get));
app.post('/api/gallery.json', authenticated(gallery.create));

app.use(express.static('public/assets'));
server.listen(process.env.PORT || 5000);
