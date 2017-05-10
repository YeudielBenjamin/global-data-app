'use strict'

var express     = require("express");
var bodyParser  = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});

// Las rutas que se usarán van aquí
app.use('auth/',require('./controllers/auth'));

module.exports = app;