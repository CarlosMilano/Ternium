import { NextApiRequest, NextApiResponse } from "next";
import { TableEmpleado } from "@/utils/types/dbTables";
import getPageEmpleados from "./services/getPageEmpleados";
import { FilterData, Filters } from "@/utils/types/filters";

export interface GetPageEmpleadosRequestBody {
    page: number;
    pageSize: number;
    filters: Filters;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { page, pageSize, filters }: GetPageEmpleadosRequestBody = req.body;
        const { nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado } = filters;
        const [count, employees]: [number, TableEmpleado[]] = await getPageEmpleados(
            page,
            pageSize,
            nombre || null,
            edad || null,
            antiguedad || null,
            universidad || null,
            area_manager || null,
            direccion || null,
            puesto || null,
            pc_cat || null,
            habilitado || null
        );

        res.status(200).json([count, employees]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
