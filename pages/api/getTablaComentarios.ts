import { NextApiRequest, NextApiResponse } from "next";
import getComentariosData from "./services/getTablaComentarios";
import { TableComentarios } from "@/utils/types/dbTables";

export interface GetComentariosRequestBody {
    id_empleado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetComentariosRequestBody = req.body;
        const result: TableComentarios[] = await getComentariosData(id_empleado);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
