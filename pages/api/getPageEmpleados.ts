import { NextApiRequest, NextApiResponse } from "next";
import { TableEmpleado } from "@/utils/types/dbTables";
import getPageEmpleados from "./services/getPageEmpleados";

export interface GetPageEmpleadosRequestBody {
    page: number;
    pageSize: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { page, pageSize }: GetPageEmpleadosRequestBody = req.body;
        const result: TableEmpleado[] = await getPageEmpleados(page, pageSize);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `No empleados were found at page ${page}, with page size ${pageSize}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
