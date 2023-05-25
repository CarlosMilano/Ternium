import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEvaluacion } from "@/utils/types/dbTables";

export default async function getEvaluacionData(id_empleado: number): Promise<TableEvaluacion[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const query: string = `
            SELECT * FROM evaluacion
            WHERE id_empleado = ${id_empleado}
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEvaluacion[];

        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve data from evaluacion.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
