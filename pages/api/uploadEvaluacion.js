import { ref, getDownloadURL} from 'firebase/storage';
import csv from 'csv-parser';
import pool from './dbConfig';
import { storage } from "../../config/environment/firebase/index";
import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', 
    },
  },
};

export default function handler(req, res) {
  const { file } = req.body;

  const storageRef = ref(storage, 'uploads/' + file);

  getDownloadURL(storageRef)
    .then((url) => {
      axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })
        .then((response) => {
          const results = [];

          response.data
            .pipe(csv())
            .on('data', (data) => {
              results.push(data);
            })
            .on('end', () => {
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

                      // Tabla Evaluacion
                      const { id_evaluacion, año, performance, potencial, curva, id_empleado } = row;

                      const evaluacionQuery =
                        'INSERT INTO evaluacion(id_empleado, id_evaluacion, año, performance, potencial, curva) VALUES($1, $2, $3, $4, $5, $6)';
                      const evaluacionValues = [id_empleado, id_evaluacion, año, performance, potencial, curva];

                      const promises = [
                        client.query(evaluacionQuery, evaluacionValues),
                      ];

                      return Promise.all(promises)
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
                          return res
                            .status(200)
                            .send('Archivo CSV cargado correctamente y registros insertados en la base de datos');
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
        })
        .catch((error) => {
          console.error('Error al descargar el archivo:', error);
          return res.status(500).send('Error al descargar el archivo');
        });
    })
    .catch((error) => {
      console.error('Error al obtener la URL de descarga:', error);
      return res.status(500).send('Error al obtener la URL de descarga');
    });
}
