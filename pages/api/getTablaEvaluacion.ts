import { NextApiRequest, NextApiResponse } from "next";
import getEvaluacionData from "./services/getTablaEvaluacion";
import { TableEvaluacion } from "@/utils/types/dbTables";

export interface GetEvaluacionRequestBody {
    id_empleado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetEvaluacionRequestBody = req.body;
        const result: TableEvaluacion[] = await getEvaluacionData(id_empleado);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
