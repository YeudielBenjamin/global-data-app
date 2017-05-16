'use strict'

const express = require('express')
const api = express.Router()

const UserController = require('../controllers/user')
const FileController = require('../controllers/file')

//RUTAS(ENDPOINTS)
//AUTH
api.post('/auth/register',UserController.register)
api.post('/auth/login',UserController.login)
//DATA
api.post('/api/data',FileController.save)
api.get('/api/data/:id',FileController.consult)

module.exports = api