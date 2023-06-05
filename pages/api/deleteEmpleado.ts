import { NextApiRequest, NextApiResponse } from "next";
import { TableEmpleado } from "@/utils/types/dbTables";
import { deleteEmpleado } from "./services/deleteEmpleado";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: TableEmpleado = req.body;
        await deleteEmpleado(id_empleado);

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: "Error updating habilitado." });
    }
}
