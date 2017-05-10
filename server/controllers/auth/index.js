'use strict'

var express = require('express');
var bodyParser  = require("body-parser");
var app = express();

var mongoose = require("mongoose");
var port = process.env.PORT || 3000;

var userSchema = new mongoose.Schema({
    name: {type:String},
    email: {type:String},
    password: {type:String}
});

var userModel = mongoose.model('user',userSchema);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

app.post("/register",function(request, response){
    var error,hasError;

    error = 'Errores:';
    hasError = false;

    //verificamos que tengamos la informacion del usuario
    if(!request.body.name){
        error += ' name is required,';
        hasError = true;
    }else if(!request.body.email){
        hasError = true;
        error += ' email is required,';
    }else if(!request.body.password){
        hasError = true;
        error += ' password is required,';
    }

    //en caso de faltar informacion, regresa error
    if(hasError){
        response.status(400).send(error);
    }

    //si no hay errores, procedemos a crear el model del usuario
    var user = new userModel({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    });

    user.save(function(error, documento){
      if(error){
         response.status(500).send('Failed to save user.');
      }else{ 
         res.redirect('/login');
      }
   });
});

app.post("/login",function(request, response){
    var error,hasError;

    error = 'Errores:';
    hasError = false;

    if(!request.body.email){
        hasError = true;
        error += ' email is required,';
    }else if(!request.body.password){
        hasError = true;
        error += ' password is required,';
    }

    //en caso de faltar informacion, regresa error
    if(hasError){
        response.status(400).send(error);
    }

    //si no hay errores, procedemos a crear el model del usuario
    var user = userModel.find({
        email:request.body.email,
        password:request.body.password
    });

    if(!user){
        response.status(401).send(error);
    }else{
        response.status(200).send(user);
    }
});