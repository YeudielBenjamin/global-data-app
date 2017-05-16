'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = Schema({ 
	name: String,
	data: Object
})

module.exports = mongoose.model('File',FileSchema)