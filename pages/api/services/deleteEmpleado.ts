import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function deleteEmpleado(id_empleado: number): Promise<void> {
    const client = await pool.connect();

    try {
        const deleteComentariosQuery = `DELETE FROM comentarios WHERE id_empleado = $1;`;
        const deleteEvaluacionQuery = `DELETE FROM evaluacion WHERE id_empleado = $1;`;
        const deleteResumenQuery = `DELETE FROM resumen WHERE id_empleado = $1;`;
        const deleteTrayectoriaQuery = `DELETE FROM trayectoria WHERE id_empleado = $1;`;
        const deleteQuery = `DELETE FROM empleado WHERE id_empleado = $1;`;

        await client.query(deleteComentariosQuery, [id_empleado]);
        await client.query(deleteEvaluacionQuery, [id_empleado]);
        await client.query(deleteResumenQuery, [id_empleado]);
        await client.query(deleteTrayectoriaQuery, [id_empleado]);
        await client.query(deleteQuery, [id_empleado]);
    } catch (err) {
        throw new Error(`Error occured when deleting employee: ${err}`);
    } finally {
        client.release();
    }
}
