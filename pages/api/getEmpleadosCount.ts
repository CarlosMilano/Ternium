import { NextApiRequest, NextApiResponse } from "next";
import getEmpleadosCount from "./services/getEmpleadosCount";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const result: number | null = await getEmpleadosCount();

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `Could not get count of table empleado.` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
