
'use strict'

const express = require('express')  
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')

const UserController = require('./controllers/user')

app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())
app.use(api)

module.exports = app
