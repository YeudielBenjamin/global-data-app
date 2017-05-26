'use strict'

const File = require('../models/file')
const Csv = require('csvtojson')

function save(req,res){
	var errors,hasError,csvData,jsonData,rows,fileName

    errors = 'Errores:'
    hasError = false

    var file_path = req.files.data.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[file_split.length - 1];

    csvData = req.files.data.path
    //fileName = req.body.fileName
    fileName = file_name



    console.log("Csvdata:" + csvData);
    console.log("File name:" + fileName);

    //verificamos que tengamos la informacion
    //no uso else if para verificar todos los campos
    if(!csvData){
        hasError = true
        errors += ' data is required,'
    }
    if(!fileName){
        fileName = ''
    }

    //en caso de errores, regresa errors
    if(hasError){
        res.status(400).send(errors)
    }

    rows = []

    //transformamos los datos de csv a json y guardamos los objetos
    Csv()
    .fromFile(csvData)
    .on('data', (data) => {
        console.log(data.toString())
        jsonData = JSON.parse(data.toString())
        rows.push(jsonData)
    })
    .on('done',(error)=>{
        if(error){
            res.status(500).send('Failed to parse data to json.')
        }else{ 

            var file = new File()
            file.name = fileName
            file.data = rows
            file.save((err, file)=>{
                if(err){
                    res.status(500).send('Error in database.')
                }else if(!file){
                    res.status(400).send('Failed to save data.')
                }else{ 
                    console.log('hasdf')
                    res.status(200).send(file)
                }
           })
        }
    })


    
}

function consult(req,res){
	var error,hasError,id

    error = 'Errores:'
    hasError = false

    id = req.params.id

    if(!id){
        hasError = true
        error += ' id is required,'
    }

    if(hasError){
        res.status(400).send(error);
    }

    File.findById(id,(err,data)=>{
        if(err){
            res.status(500).send('Error connecting to db')
        }else if(!data){
            res.status(401).send('Could not find data');
        }else{
            res.status(200).send(data);
        }
    });

}

module.exports = {
	save,
	consult
}