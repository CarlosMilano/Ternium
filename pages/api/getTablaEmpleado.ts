import { NextApiRequest, NextApiResponse } from "next";
import getEmpleadoData from "./services/getTablaEmpleado";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const result: TableEmpleado[] = await getEmpleadoData();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
}
