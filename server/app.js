
'use strict'

const express = require('express')  
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')
const passport = require('./config/passport')

app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(api)

/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});*/

module.exports = app
