import { NextApiRequest, NextApiResponse } from "next";
import getTrayectoriaData from "./services/getTablaTrayectoria";
import { TableTrayectoria } from "@/utils/types/dbTables";

export interface GetTrayectoriaRequestBody {
    id_empleado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { id_empleado }: GetTrayectoriaRequestBody = req.body;
        const result: TableTrayectoria[] = await getTrayectoriaData(id_empleado);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
