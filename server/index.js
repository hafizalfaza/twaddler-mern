import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import open from 'open';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

import register from './routes/register';
import auth from './routes/auth';
import events from './routes/events';
import users from './routes/users';
import search from './routes/search';

import mongoose from 'mongoose';
import config from './config/database';
import SocketIO from 'socket.io';
import socketEvents from './socket/socketEvents';

const app = express();

let user = [];
let connections = [];


mongoose.Promise = global.Promise;

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
	console.log('Connected to database '+ config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Database error: '+ err);
});



const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
	hot: true,
	publicPath: webpackConfig.output.publicPath,
	noInfo: true
}));

app.use(webpackHotMiddleware(compiler));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/register', register);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/users', users);
app.use('/search', search);

const port = 3000;

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(port, () => {
	console.log('Server running on port '+ port + '...');
});

const io = require('socket.io')(server);  

socketEvents(io);




