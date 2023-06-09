import { NextApiRequest, NextApiResponse } from "next";
import { updateTablaTrayectoria } from "./services/updateTablaTrayectoria";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { empresa, puesto, id_trayectoria, id_empleado } = req.body;

    try {
        const result = await updateTablaTrayectoria(empresa, puesto, id_trayectoria, id_empleado);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Error updating data" });
    }
}
