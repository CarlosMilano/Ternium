import { NextApiRequest, NextApiResponse } from "next";
import { TableEmpleado } from "@/utils/types/dbTables";
import getEmpleados from "./services/getEmpleados";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const result: TableEmpleado[] = await getEmpleados();

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `No empleados were found` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
