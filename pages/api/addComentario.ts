import { NextApiRequest, NextApiResponse } from "next";
import { TableComentarios } from "@/utils/types/dbTables";
import { addComentario } from "./services/addComentario";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado, nota, comentario }: TableComentarios = req.body;
        console.log(`id_empleado: ${id_empleado}, nota: ${nota}, comentario: ${comentario}`);
        if (nota == null || comentario == null) {
            throw new Error("At least one value is missing in provided object.");
        }
        console.log("starting...");
        const id_comentario: number = await addComentario(id_empleado, nota, comentario);

        res.status(200).json({ id_comentario: id_comentario });
    } catch (error) {
        res.status(500).json({ error: `Error: ${error}` });
    }
}
