import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableComentarios, TableResumen, TableEvaluacion, TableTrayectoria } from "@/utils/types/dbTables";

export interface GetAllTablesResult {
    comentarios: TableComentarios[] | null;
    resumen: TableResumen[] | null;
    evaluacion: TableEvaluacion[] | null;
    trayectoria: TableTrayectoria[] | null;
}

export default async function getAllTables(id_empleado: number): Promise<GetAllTablesResult> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const queryComentarios: string = `
            SELECT * FROM comentarios
            WHERE id_empleado = ${id_empleado}
        `;
        const queryResumen: string = `
            SELECT * FROM resumen
            WHERE id_empleado = ${id_empleado}
        `;
        const queryEvaluacion: string = `
            SELECT * FROM evaluacion
            WHERE id_empleado = ${id_empleado}
        `;
        const queryTrayectoria: string = `
            SELECT * FROM trayectoria
            WHERE id_empleado = ${id_empleado}
        `;

        // Fetching comentarios.
        try {
            var resultComentarios: QueryResult = await client.query(queryComentarios);
            var comentarios: TableComentarios[] | null = resultComentarios.rows as TableComentarios[];
        } catch (err) {
            console.error(`Failed to retrieve comentarios from empleado with id ${id_empleado}`);
            var comentarios: TableComentarios[] | null = null;
        }
        // Fetching resumen.
        try {
            var resultResumen: QueryResult = await client.query(queryResumen);
            var resumen: TableResumen[] | null = resultResumen.rows as TableResumen[];
        } catch (err) {
            console.error(`Failed to retrieve resumen from empleado with id ${id_empleado}`);
            var resumen: TableResumen[] | null = null;
        }
        // Fetching evaluacion.
        try {
            var resultEvaluacion: QueryResult = await client.query(queryEvaluacion);
            var evaluacion: TableEvaluacion[] | null = resultEvaluacion.rows as TableEvaluacion[];
        } catch (err) {
            console.error(`Failed to retrieve evaluacion from empleado with id ${id_empleado}`);
            var evaluacion: TableEvaluacion[] | null = null;
        }
        // Fetching trayectoria.
        try {
            var resultTrayectoria: QueryResult | null = await client.query(queryTrayectoria);
            var trayectoria: TableTrayectoria[] | null = resultTrayectoria.rows as TableTrayectoria[];
        } catch (err) {
            console.error(`Failed to retrieve trayectoria from empleado with id ${id_empleado}`);
            var trayectoria: TableTrayectoria[] | null = null;
        }

        return {
            comentarios: comentarios,
            resumen: resumen,
            evaluacion: evaluacion,
            trayectoria: trayectoria,
        };
    } catch (err) {
        throw new Error(`Failed to connect to pool client.`);
    } finally {
        if (client) {
            client.release();
        }
    }
}
