import { NextApiRequest, NextApiResponse } from "next";
import { TableComentarios, TableEmpleado } from "@/utils/types/dbTables";
import { deleteEmpleado } from "./services/deleteEmpleado";
import { deleteComentario } from "./services/deleteComentario";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado, id_comentario }: TableComentarios = req.body;
        await deleteComentario(id_empleado, id_comentario);

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: "Error updating habilitado." });
    }
}
