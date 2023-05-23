import { NextApiRequest, NextApiResponse } from 'next';
import { getTrayectoriaData } from './services/getTablaTrayectoria';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getTrayectoriaData();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
