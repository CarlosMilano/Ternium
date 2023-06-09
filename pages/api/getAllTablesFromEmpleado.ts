import { NextApiRequest, NextApiResponse } from "next";
import getAllTables, { GetAllTablesResult } from "./services/getAllTablesFromEmpleado";

export interface GetAllTablesRequestBody {
    id_empleado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetAllTablesRequestBody = req.body;
        const result: GetAllTablesResult = await getAllTables(id_empleado);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
