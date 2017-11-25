import http from 'http';
import { tmpdir } from 'os';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import { composeP } from 'ramda';
import renderApplication from './universal';
import { login, fetchUser, authenticate, authenticated } from './api/auth';
import * as layouts from './api/layouts';
import * as page from './api/page';
import * as meta from './api/meta';
import * as mail from './api/mail';
import * as gallery from './api/gallery';

const app = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const upload = multer({ dest: tmpdir() });

app.get(/[/|.*\.html]$/, renderApplication);
app.post('/admin/login.html', authenticate);
app.post('/api/mail.json', mail.send);

app.get('/api/page/:id.json', page.getOne);
app.get('/api/pages.json', page.getAll);
app.put('/api/page/:id.json', authenticated(page.update));
app.post('/api/page.json', authenticated(page.create));
app.delete('/api/page/:id.json', authenticated(page.del));

app.get('/api/user.json', fetchUser);
app.get('/api/layouts.json', authenticated(layouts.getAll));
app.get('/api/meta.json', meta.getAll);
app.put('/api/meta.json', authenticated(meta.update));

app.get('/api/gallery/:id.json', gallery.getOne);
app.patch('/api/gallery/:id.json', upload.single('image'), authenticated(gallery.upload));
app.put('/api/gallery/:id.json', authenticated(gallery.update));
app.get('/api/galleries.json', authenticated(gallery.getAll));
app.post('/api/gallery.json', authenticated(gallery.create));

app.use(express.static('public/assets'));
server.listen(process.env.PORT || 5000);
