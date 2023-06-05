import { NextApiRequest, NextApiResponse } from "next";
import getResumenData from "./services/getTablaResumen";
import { TableResumen } from "@/utils/types/dbTables";

export interface GetResumenRequestBody {
    id_empleado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetResumenRequestBody = req.body;
        const result: TableResumen[] = await getResumenData(id_empleado);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
