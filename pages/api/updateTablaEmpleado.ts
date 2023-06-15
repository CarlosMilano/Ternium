import { NextApiRequest, NextApiResponse } from "next";
import { updateTablaEmpleados } from "./services/updateTablaEmpleado";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const {
        nombre,
        edad,
        antiguedad,
        universidad,
        area_manager,
        direccion,
        puesto,
        pc_cat,
        habilitado,
        id_empleado,
        estructura3,
        estructura4,
        estructura5,
        key_talent,
    }: TableEmpleado = req.body;

    try {
        const result = await updateTablaEmpleados(
            nombre || null,
            edad || null,
            antiguedad || null,
            universidad || null,
            area_manager || null,
            direccion || null,
            puesto || null,
            pc_cat || null,
            habilitado || null,
            id_empleado,
            estructura3 || null,
            estructura4 || null,
            estructura5 || null,
            key_talent !== undefined ? key_talent : null
        );
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Error updating data" });
    }
}
