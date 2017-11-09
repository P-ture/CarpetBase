import http from 'http';
import express from 'express';
import compression from 'compression';
import { PORT } from '../js/config';
import fetchHtml from './universal';
import fetchPage from './api/page';

const app = express();
app.use(compression());

const server = http.createServer(app);

app.get(/[/|.*\.html]$/, fetchHtml);
app.get('/api/page/:slug.json', fetchPage);

app.use(express.static('public/assets'));
server.listen(PORT);
