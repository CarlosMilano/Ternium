import pool from '../dbConfig';

export async function getEmployeesData() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM empleado, comentarios, evaluacion, resumen, trayectoria WHERE empleado.id_empleado = comentarios.id_comentario AND comentarios.id_comentario = evaluacion.id_evaluacion AND evaluacion.id_evaluacion = resumen.id_resumen AND resumen.id_resumen = trayectoria.id_trayectoria");
    return result.rows;
  } finally {
    client.release();
  }
}
