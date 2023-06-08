const express = require('express');
const { Pool } = require('pg');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const pool = new Pool({
    connectionString: 'postgres://adter01:nn32BrziGP6wyLXBLmgRSOrlmfPV0O5v@dpg-chh57gbhp8u065v23l4g-a.oregon-postgres.render.com/terniumtalentdb',
});

// Ruta para manejar la carga del archivo CSV y la inserción en la base de datos
app.post('/upload', (req, res) => {
  const results = [];

  // Utiliza formidable para manejar la carga del archivo CSV
  // Puedes ajustar las opciones según tus necesidades
  const formidable = require('formidable');
  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al procesar el archivo CSV');
    } else {
      const file = files.file;

      // Utiliza csv-parser para leer el contenido del archivo CSV
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          // Realiza la inserción en la base de datos
          const query = 'INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado, fecha_nacimiento, cet, idm4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';

          pool.connect((err, client, done) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error al conectar a la base de datos');
            } else {
              // Realiza una transacción para insertar los registros en la base de datos
              client.query('BEGIN', (err) => {
                if (err) {
                  console.error('Error al iniciar la transacción:', err);
                  res.status(500).send('Error al iniciar la transacción');
                } else {
                  // Inserta cada registro en la base de datos
                  results.forEach((row) => {
                    const values = Object.values(row);
                    client.query(query, values, (err) => {
                      if (err) {
                        console.error('Error al insertar el registro:', err);
                        client.query('ROLLBACK', () => {
                          res.status(500).send('Error al insertar los registros');
                        });
                      }
                    });
                  });

                  // Confirma la transacción y finaliza la conexión
                  client.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error al confirmar la transacción:', err);
                      client.query('ROLLBACK', () => {
                        res.status(500).send('Error al confirmar la transacción');
                      });
                    } else {
                      done();
                      res.status(200).send('Archivo CSV cargado correctamente y registros insertados en la base de datos');
                    }
                  });
                }
              });
            }
          });
        });
    }
  });
});

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor Express en funcionamiento en el puerto 3000');
});
