import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      res.status(200).json({ success: true, data: req.body });
    } catch (error) {
      console.error('Erro ao enviar dado:', error);
      res.status(500).json({ error: 'Erro ao enviar dados' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}