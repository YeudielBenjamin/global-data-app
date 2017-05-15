'use strict'

const express = require('express')
const api = express.Router()

const UserController = require('../controllers/user')

//RUTAS(ENDPOINTS)
api.post('/auth/register',UserController.register)
api.post('/auth/login',UserController.login)

module.exports = api