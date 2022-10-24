// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
export default async (req: NextApiRequest, res: NextApiResponse) => {

  const prisma = new PrismaClient();
  if (req.method !== 'DELETE') {
    return res.status(405).json({message: 'Method not allowed'});
  }

  const pendingLetterbox = JSON.parse(req.body);

  console.log(pendingLetterbox);
  const response = await prisma.pendingLetterbox.delete({
    where: {
        url_hash: pendingLetterbox.url_hash
    }
  });

  res.json(response);
};