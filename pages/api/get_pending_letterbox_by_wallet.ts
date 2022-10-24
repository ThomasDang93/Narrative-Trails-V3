// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  if (req.method !== 'GET') {
    return res.status(405).json({message: 'Method not allowed'});
  }
  console.log(req.query.wallet_address);

  const response = await prisma.pendingLetterbox.findMany({
        where: {
            wallet_address: req.query.wallet_address.toString()
        },
        select: {
            url_hash: true,
            id: true,
            letterbox_name: true,
            image_uri: true,
            wallet_address: true
        }
   });

  res.json(response);
};
