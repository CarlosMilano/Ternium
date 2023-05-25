import { NextApiRequest, NextApiResponse } from "next";
import { updateTablaComentarios } from "./services/updateTablaComentarios";
import { TableComentarios } from "@/utils/types/dbTables";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { comentario, nota, promedio_notas, id_empleado, id_comentario }: TableComentarios = req.body;

    try {
        const result = await updateTablaComentarios(
            id_comentario,
            comentario || null,
            nota || null,
            promedio_notas || null,
            id_empleado
        );
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Error updating data" });
    }
}
