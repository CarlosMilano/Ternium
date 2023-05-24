import { NextApiRequest, NextApiResponse } from 'next';
import { updateTablaResumen } from './services/updateTablaResumen';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { resumen_perfil, id_empleado } = req.body;

  try {
    const result = await updateTablaResumen(resumen_perfil, id_empleado);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Error updating data' });
  }
}