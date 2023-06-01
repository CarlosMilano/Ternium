import fs from "fs";
import csvParser from "csv-parser";
import pool from "../dbConfig";

export default function handler(req, res) {
  let counter = 0;

  fs.createReadStream("./public/csv/prueba_csv.csv")
    .pipe(csvParser())
    .on("data", function (record) {
      let id_empleado = record.id_empleado;
      let nombre = record.nombre;
      let edad = record.edad;
      let antiguedad = record.antiguedad;
      let universidad = record.universidad;
      let area_manager = record.area_manager;
      let direccion = record.direccion;
      let puesto = record.puesto;
      let pc_cat = record.pc_cat;
      let habilitado = record.habilitado;

      console.log(record);

      pool.query(
        "INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          id_empleado,
          nombre,
          edad,
          antiguedad,
          universidad,
          area_manager,
          direccion,
          puesto,
          pc_cat,
          habilitado,
        ],
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      ++counter;
    })
    .on("end", function (res) {
      console.log("Done");
      res.status(200).end();
    })
    .on("error", function (err) {
      console.log(err);
      res.status(500).json({ error: "Error al cargar el CSV" });
    });
}
