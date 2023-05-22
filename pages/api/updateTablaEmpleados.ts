import { NextApiRequest, NextApiResponse } from 'next';
import { updateTablaEmpleados } from './services/updateTablaEmpleado';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await updateTablaEmpleados();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}