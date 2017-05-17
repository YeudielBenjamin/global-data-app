'use strict'

const express = require('express')
const multipart = require("connect-multiparty")
const api = express.Router()
var md_upload = multipart({ uploadDir: "../server/uploads/files"});

const UserController = require('../controllers/user')
const FileController = require('../controllers/file')

//RUTAS(ENDPOINTS)
//AUTH
api.post('/auth/register',UserController.register)
api.post('/auth/login',UserController.login)
//DATA
api.post('/api/data', md_upload, FileController.save)
api.get('/api/data/:id',FileController.consult) 

module.exports = api