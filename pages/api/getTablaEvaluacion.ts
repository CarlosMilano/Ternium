import { NextApiRequest, NextApiResponse } from 'next';
import { getEvaluacionData } from './services/getTablaEvaluacion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getEvaluacionData();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
