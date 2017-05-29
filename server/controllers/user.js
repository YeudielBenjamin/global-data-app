'use strict'

const User = require('../models/user')

var MANAGER = 'manager'
var ADMIN = 'admin'
 
function register(req,res){
	var errors,hasError,name,email,password,phone,type

    errors = 'Errores:'
    hasError = false

    name = req.body.name
    email = req.body.email
    password = req.body.password
    phone = req.body.phone
    type = req.body.type

    User.findOne({
        'email':email
    },(err,user)=>{
        if(err){
            res.status(500).send('Error in database')
        }
        else if(user){
            res.status(400).send('The email is registered in the database')
        }
    })

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
    if(!phone){
        phone = 'without phone'//no obligatorio
    }
    if(!type){
        type = MANAGER
    }else{
        type = ADMIN
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
    user.phone = phone
    user.provider = 'local'
    user.type = type

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
        password:password,
        provider:'local'//si inicia sesion con facebook o google, no se guarda contraseña
    },(err,user)=>{
        if(err){
            res.status(500).send('Error in database')
        }
        else if(!user){
            res.status(400).send('Cant save user');
        }else{
            res.status(200).send(user);
        }
    });

}

function facebookLogin(req,res){
    res.status(200).send(req.user)
}

function googleLogin(req,res){
    res.status(200).send(req.user)
}

module.exports = {
	register,
	login,
    facebookLogin,
    googleLogin
}