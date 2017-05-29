'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, (err, res) => {
  if (err){
    return console.log('Error al conectar a la base de datos')
  }
  console.log('Conexion a la DB establecida')

  app.listen(config.port, () => {
    console.log('API REST corriendo en http://localhost:' + config.port)
  })
})

//INICIALIZANDO 2 USUARIOS POR DEFECTO
const User = require('./models/user')

User.findOne({
	email: 'admin@gmail.com',
	password: 'admin'
},(err, user)=>{
	if(err){
		console.log('Error al conectar a la base de datos')
	}else if(!user){
		var user = new User()
		user.name = 'admin'
		user.email = 'admin@gmail.com'
		user.password = 'admin'
		user.phone = 'no phone for admin'
		user.provider = 'local'
		user.type = 'admin'

		user.save()
	}
})

User.findOne({
	email: 'manager@gmail.com',
	password: 'manager'
},(err, user)=>{
	if(err){
		console.log('Error al conectar a la base de datos')
	}else if(!user){
		var user = new User()
		user.name = 'manager'
		user.email = 'manager@gmail.com'
		user.password = 'manager'
		user.phone = 'no phone for manager'
		user.provider = 'local'
		user.type = 'manager'

		user.save()
	}
})


