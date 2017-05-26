'use strict'

var mongoose = require("mongoose");
var app      = require("./app");
var config   = require('./config')

mongoose.connect(config.db, (err, res) => {
    if(err){
        console.log("Sucedió un error al conectar a la base de datos");
        throw err;
    }
    else{
        app.listen(config.port, (err, res) => {
            if (err) {
                console.log("Sucedió un error mientras se cargaba la aplicación");
                throw err;
            } else {
                console.log("Aplicación corriendo en http://localhost:" + config.port); 
            }
        });
    }
});