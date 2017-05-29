'use strict'

const express = require('express')
const multipart = require("connect-multiparty")
const api = express.Router()
var md_upload = multipart({ uploadDir: "../server/uploads/files"})

const UserController = require('../controllers/user')
const FileController = require('../controllers/file')

const passport =  require('../config/passport')

//RUTAS(ENDPOINTS)
//AUTH
api.post('/auth/register',UserController.register)
api.post('/auth/login',UserController.login)

api.get('/auth/facebook',passport.authenticate('facebook', { scope : ['email'] }))
api.get('/auth/facebook/callback',passport.authenticate('facebook'),UserController.facebookLogin)
api.get('/auth/google',passport.authenticate('google', { scope : ['email'] }))
api.get('/auth/google/callback',passport.authenticate('google'),UserController.googleLogin)
//DATA
api.post('/api/data', md_upload, FileController.save)
api.get('/api/data/:id',FileController.consult)
api.post('/api/data/datamining',FileController.dataMining) 

module.exports = api