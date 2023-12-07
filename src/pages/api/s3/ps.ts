// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPresignedUrl } from "@/lib/s3/presigned";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fileName = req.body.fileName;

  const presignedUrl = await getPresignedUrl(fileName);

  const getURL = presignedUrl.split("?")[0];

  res.status(200).json({ putURL: presignedUrl, getURL: getURL });
}
