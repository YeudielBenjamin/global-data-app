'use strict'

const User = require('../models/user')

function register(req,res){
	var errors,hasError,name,email,password

    errors = 'Errores:'
    hasError = false

    name = req.body.name
    email = req.body.email
    password = req.body.password

    //verificamos que tengamos la informacion del usuario
    //no uso else if para verificar todos los campos
    if(!name){
        hasError = true
        errors += ' name is required,'
    }
    if(!email){
        hasError = true
        errors += ' email is required,'
    }
    if(!password){
        hasError = true
        errors += ' password is required,'
    }

    //en caso de faltar informacion, regresa errors
    if(hasError){
        res.status(400).send(errors)
    }

    //si no hay errores, procedemos a crear el model del usuario
    var user = new User()
    user.name = name
    user.email = email
    user.password = password

    user.save((err, user)=>{
        if(err){
            res.status(500).send('Failed to save user.')
        }else{ 
            res.status(200).send(user)
        }
   })
}

function login(req,res){
	var error,hasError,email,password

    error = 'Errores:'
    hasError = false

    email = req.body.email
    password = req.body.password

    if(!email){
        hasError = true
        error += ' email is required,'
    }
    if(!password){
        hasError = true
        error += ' password is required,'
    }

    if(hasError){
        res.status(400).send(error);
    }

    User.findOne({
        email:email,
        password:password
    },(err,user)=>{
        if(err){
            res.status(500).send('Error al realizar la peticion')
        }
        else if(!user){
            res.status(401).send('No se pudo encontrar el usuario');
        }else{
            res.status(200).send(user);
        }
    });

}

module.exports = {
	register,
	login
}