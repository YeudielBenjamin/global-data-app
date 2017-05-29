'use strict'

const User = require('../models/user')


 function getUsers (req, res){
    var users;

    users = User.find();
    console.log(users);

 }

 //GET - Return all registers
function  findAll  (req, res) {
    console.log('FIND ALL');
 User.find(function(err, users) {
 if(err) res.send(500, err.message);
 console.log('GET /users')
 res.status(200).jsonp(users);
 });
};



function getUser(req,res){
    var userId = req.body.id;

    res.status(200).send({message: 'Accion get user'});



}



function register(req,res){
	var errors,hasError,name,email,password,phone

    errors = 'Errores:'
    hasError = false

    name = req.body.name
    email = req.body.email
    password = req.body.password
    phone = req.body.phone

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
    googleLogin,
    getUsers,
    getUser,
    findAll
}