'use strict'

var mongoose = require("mongoose");
var app      = require("./app");
 
var port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/global-data-app", (err, res) => {
    if(err){
        console.log("Sucedió un error al conectar a la base de datos");
        throw err;
    }
    else{
        app.listen(port, (err, res) => {
            if (err) {
                console.log("Sucedió un error mientras se cargaba la aplicación");
                throw err;
            } else {
                console.log("Aplicación corriendo en http://localhost:" + port);
            }
        });
    }
});