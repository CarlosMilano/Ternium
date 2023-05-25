import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableTrayectoria } from "@/utils/types/dbTables";

export default async function getTrayectoriaData(id_empleado: number): Promise<TableTrayectoria[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const query: string = `
            SELECT * FROM trayectoria
            WHERE id_empleado = ${id_empleado}
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableTrayectoria[];

        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve data from trayectoria.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
