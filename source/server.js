'use strict'

// environment setup
import dotenv from 'dotenv'
const result = (process.env.NODE_ENV == 'development') ? dotenv.config() : false

// dependencies
import express from 'express'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import expressValidator from 'express-validator'
import cookieParser from 'cookie-parser'

// controllers
import index from './controllers/index.js'

// db and models
import database from './database/database.js'

// handlebars helpers
import exphbsConfig from './config/exphbs-config.js'
const exphbs = handlebars.create(exphbsConfig);

// whatevers
import checkAuth from './lib/check-auth.js'
import checkCookie from './lib/check-cookie.js'

// set our express options
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(expressValidator());
app.use(cookieParser());
app.use(checkCookie);

// set our view engine
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

// routes
app.use('/', index)

// face the world
const hotPort = app.get('port')
const server = app.listen(hotPort, () => {
    console.log(`App listening on port ${hotPort}!`)
})

// for Mocha/Chai test purposes
export default server;
