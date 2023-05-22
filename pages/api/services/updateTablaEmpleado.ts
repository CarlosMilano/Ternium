import pool from '../dbConfig';

export async function updateTablaEmpleados() {
  const client = await pool.connect();

  try {
    const result = await client.query("UPDATE empleado SET nombre = COALESCE($1, nombre), edad = COALESCE($2, edad), antiguedad = COALESCE($3, antiguedad), universidad = COALESCE($4, universidad), area_manager = COALESCE($5, area_manager), direccion = COALESCE($6, direccion), puesto = COALESCE($7, puesto), pc_cat = COALESCE($8, pc_cat) WHERE id_empleado = $9");
    return result.rows;
  } finally {
    client.release();
  }
}