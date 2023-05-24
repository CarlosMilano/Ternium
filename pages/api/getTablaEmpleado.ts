import { NextApiRequest, NextApiResponse } from "next";
import getEmpleadoData from "./services/getTablaEmpleado";
import { TableEmpleado } from "@/utils/types/dbTables";

export interface GetEmpleadoRequestBody {
    id_empleado: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetEmpleadoRequestBody = req.body;
        const result: TableEmpleado | null = await getEmpleadoData(id_empleado);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `Empleado with id_empleado = ${id_empleado} not found` });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
}
