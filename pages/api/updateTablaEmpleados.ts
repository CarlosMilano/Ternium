import { NextApiRequest, NextApiResponse } from 'next';
import { updateTablaEmpleados } from './services/updateTablaEmpleado';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, id_empleado } = req.body;

  try {
    const result = await updateTablaEmpleados(nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, id_empleado);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Error updating data' });
  }
}