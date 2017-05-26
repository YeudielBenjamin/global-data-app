'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
	name: String,
    email: String,
    password: String,
    phone: String,
    provider: String
})

module.exports = mongoose.model('User',UserSchema)