var fs = require("fs")
var csv = require("fast-csv")
const pool = require("./api/dbConfig")

pool.connect(function(err){
    if(err)
    {
        console.log(err)
    }
})

let counter = 0

let csvStream = csv.fromPath(".\\csv\\prueba_csv.csv", { headers: true })
    .on("data", function(record){
        csvStream.pause()

        if(counter < 5)
        {
            let id_empleado = record.id_empleado
            let nombre = record.nombre
            let edad = record.edad
            let antiguedad = record.antiguedad
            let universidad = record.universidad
            let area_manager = record.area_manager
            let direccion = record.direccion
            let puesto = record.puesto
            let pc_cat = record.pc_cat
            let habilitado = record.habilitado

            pool.query("INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado], function(err){
                if(err)
                {
                    console.log(err)
                }
            })
            ++counter

        }

        csvStream.resume()
    }).on("end", function(){
        console.log("Done")
    }).on("error", function(err){
        console.log(err)
    })