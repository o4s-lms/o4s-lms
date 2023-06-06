import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getCookie('hanko', { req, res });

  return res.status(200).send(token);
}