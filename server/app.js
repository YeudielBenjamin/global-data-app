'use strict'

const express = require('express')  
const bodyParser = require('body-parser')
const app = express()

const UserController = require('./controllers/user')

app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

//RUTAS(ENDPOINTS)
app.post('/auth/register',UserController.register)
app.post('/auth/login',UserController.login)

module.exports = app