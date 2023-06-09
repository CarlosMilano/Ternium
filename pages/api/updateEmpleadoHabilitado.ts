import { NextApiRequest, NextApiResponse } from "next";
import { TableEmpleado } from "@/utils/types/dbTables";
import { updateEmpleadoHabilitado } from "./services/updateEmpleadoHabilitado";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado, habilitado }: TableEmpleado = req.body;
        await updateEmpleadoHabilitado(id_empleado, habilitado === undefined ? null : habilitado);

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: "Error updating habilitado." });
    }
}
