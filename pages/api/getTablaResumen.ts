import { NextApiRequest, NextApiResponse } from 'next';
import getResumenData from './services/getTablaResumen';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getResumenData();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
