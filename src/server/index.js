import http from 'http';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { PORT } from '../js/config';
import renderApplication from './universal';
import { login, fetchUser, authenticate } from './api/auth';
import fetchPage from './api/page';

const app = express();
app.use(compression());
app.use(cookieParser());

const server = http.createServer(app);

app.get(/[/|.*\.html]$/, renderApplication);
app.get('/api/authenticate.json', authenticate);
app.get('/api/user.json', fetchUser);
app.get('/api/page/:slug.json', fetchPage);

app.use(express.static('public/assets'));
server.listen(PORT);
