import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import dbConfig from './dbConfig';

const pool = dbConfig.default;

const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};



export default function handler(req, res) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al cargar el archivo' });
    }

    const { path } = req.file;
    const results = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // Insertar los datos en la base de datos
        const query = 'INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado, fecha_nacimiento, cet, idm4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';

        pool.connect((err, client, done) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error al conectar a la base de datos');
          }

          client.query('BEGIN', (err) => {
            if (err) {
              console.error('Error al iniciar la transacción:', err);
              client.query('ROLLBACK', () => {
                return res.status(500).send('Error al iniciar la transacción');
              });
            } else {
              const insertPromises = results.map((row) => {
                const values = Object.values(row);
                return client.query(query, values)
                  .catch((err) => {
                    console.error('Error al insertar el registro:', err);
                    client.query('ROLLBACK');
                    throw err;
                  });
              });

              Promise.all(insertPromises)
                .then(() => {
                  client.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error al confirmar la transacción:', err);
                      client.query('ROLLBACK');
                      return res.status(500).send('Error al confirmar la transacción');
                    }

                    done();
                    return res.status(200).send('Archivo CSV cargado correctamente y registros insertados en la base de datos');
                  });
                })
                .catch(() => {
                  done();
                  return res.status(500).send('Error al insertar los registros');
                });
            }
          });
        });
      });
  });
}
