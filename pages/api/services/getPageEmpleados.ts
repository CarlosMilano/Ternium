import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";
import { FilterData } from "@/utils/types/filters";

export default async function getPageEmpleados(
    page: number,
    pageSize: number,
    nombre: FilterData | null,
    edad: FilterData | null,
    antiguedad: FilterData | null,
    universidad: FilterData | null,
    area_manager: FilterData | null,
    direccion: FilterData | null,
    puesto: FilterData | null,
    pc_cat: FilterData | null,
    habilitado: FilterData | null
): Promise<[number, TableEmpleado[]]> {
    let client: PoolClient | null = null;
    const createAND = (name: string, filter: FilterData | null, isString: boolean = true) => {
        if (!filter) return "";
        return isString
            ? `AND LOWER (${name}) LIKE LOWER('${filter.value}%') `
            : `AND ${name} ${filter.condition} ${filter.value} `;
    };
    try {
        client = (await pool.connect()) as PoolClient;

        // Start of queries.
        let countQuery: string = `
            SELECT COUNT(*)
            FROM empleado
            WHERE TRUE 
        `;
        let query: string = `
            SELECT * 
            FROM empleado 
            WHERE TRUE 
        `;

        // Calculates all AND parts of the queries.
        let queryANDs: string = "";
        queryANDs += createAND("nombre", nombre);
        queryANDs += createAND("edad", edad, false);
        queryANDs += createAND("antiguedad", antiguedad, false);
        queryANDs += createAND("universidad", universidad);
        queryANDs += createAND("area_manager", area_manager);
        queryANDs += createAND("direccion", direccion);
        queryANDs += createAND("puesto", puesto);
        queryANDs += createAND("pc_cat", pc_cat);
        queryANDs += createAND("habilitado", habilitado, false);

        // Finished queries.
        countQuery += queryANDs;
        query += queryANDs;
        query += ` 
            ORDER BY id_empleado
            LIMIT ${pageSize}
            OFFSET ${page * pageSize}
        `;

        const countResult: QueryResult = await client.query(countQuery);
        const count: number = countResult.rows[0];
        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEmpleado[];
        return [count, rows];
    } catch (err) {
        throw new Error("Failed to retrieve paginated data from table empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
