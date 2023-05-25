import { NextApiRequest, NextApiResponse } from "next";
import { updateTablaEvaluacion } from "./services/updateTablaEvaluacion";
import { TableEvaluacion } from "@/utils/types/dbTables";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { curva, año, performance, potencial, id_empleado, id_evaluacion }: TableEvaluacion = req.body;

    try {
        const result = await updateTablaEvaluacion(
            id_evaluacion,
            curva || null,
            año || null,
            performance || null,
            potencial || null,
            id_empleado
        );
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Error updating data" });
    }
}
