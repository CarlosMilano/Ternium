import { createReadStream, createWriteStream } from 'fs';
import { ref, getDownloadURL, getMetadata } from 'firebase/storage';
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

  const storageRef = ref(storage, 'csvFiles/' + file);
  
  getMetadata(storageRef)
    .then((metadata) => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(metadata.fullPath)}?alt=media&token=${metadata.downloadTokens}`;
      
      const results = [];

      axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })
        .then((response) => {
          const filePath = '../../uploads' + file; // Directorio temporal para guardar el archivo descargado
          const fileStream = createWriteStream(filePath);

          response.data.pipe(fileStream);

          fileStream.on('finish', () => {
            createReadStream(filePath)
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
                  // Tabla Empleado
                  const {
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
                    fecha_nacimiento,
                    cet,
                    idm4,
                  } = row;

                  const empleadoQuery =
                    'INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado, fecha_nacimiento, cet, idm4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
                  const empleadoValues = [
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
                    fecha_nacimiento,
                    cet,
                    idm4,
                  ];

                  // Tabla Evaluacion
                  const { id_evaluacion, año, performance, potencial, curva } = row;

                  const evaluacionQuery =
                    'INSERT INTO evaluacion(id_evaluacion, año, performance, potencial, curva, id_empleado) VALUES($1, $2, $3, $4, $5, $6)';
                  const evaluacionValues = [id_evaluacion, año, performance, potencial, curva, id_empleado];

                  // Tabla Resumen
                  const { id_resumen, resumen_perfil } = row;

                  const resumenQuery =
                    'INSERT INTO resumen(id_resumen, resumen_perfil, id_empleado) VALUES($1, $2, $3)';
                  const resumenValues = [id_resumen, resumen_perfil, id_empleado];

                  // Tabla Comentario
                  const { id_comentario, nota, promedio_notas, comentario } = row;

                  const comentarioQuery =
                    'INSERT INTO comentarios(id_comentario, nota, promedio_notas, comentario, id_empleado) VALUES($1, $2, $3, $4, $5)';
                  const comentarioValues = [id_comentario, nota, promedio_notas, comentario, id_empleado];

                  // Tabla Trayectoria
                  const { id_trayectoria, empresa, fecha_inicio, fecha_fin } = row;

                  const trayectoriaQuery =
                    'INSERT INTO trayectoria(id_trayectoria, empresa, puesto, id_empleado, fecha_inicio, fecha_fin) VALUES($1, $2, $3, $4, $5, $6)';
                  const trayectoriaValues = [
                    id_trayectoria,
                    empresa,
                    puesto,
                    id_empleado,
                    fecha_inicio,
                    fecha_fin,
                  ];

                  const promises = [
                    client.query(empleadoQuery, empleadoValues),
                    client.query(evaluacionQuery, evaluacionValues),
                    client.query(resumenQuery, resumenValues),
                    client.query(comentarioQuery, comentarioValues),
                    client.query(trayectoriaQuery, trayectoriaValues),
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
  });

  fileStream.on('error', (error) => {
    console.error('Error al guardar el archivo descargado:', error);
    return res.status(500).send('Error al guardar el archivo descargado');
  });
})
.catch((error) => {
  console.error('Error al descargar el archivo:', error);
  return res.status(500).send('Error al descargar el archivo');
});
})
.catch((error) => {
console.error(error);
return res.status(500).send('Error al obtener los metadatos del archivo');
});
}
