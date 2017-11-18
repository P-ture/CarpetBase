import http from 'http';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { composeP } from 'ramda';
import renderApplication from './universal';
import { login, fetchUser, authenticate } from './api/auth';
import { fetchPage, fetchPages, updatePage, fetchLayouts } from './api/page';
import fetchNavigation from './api/navigation';
import { fetchMeta, updateMeta } from './api/meta';
import sendMail from './api/mail';

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
app.post('/api/page/:slug.json', updatePage);
app.get('/api/pages.json', fetchPages);
app.get('/api/navigation.json', fetchNavigation);
app.get('/api/meta.json', fetchMeta);
app.get('/api/layouts.json', fetchLayouts);
app.post('/api/meta.json', updateMeta);
app.post('/api/mail.json', sendMail);

app.use(express.static('public/assets'));
server.listen(process.env.PORT || 5000);
