import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
dotenv.config();

export default function get(
  _req: NextApiRequest,
  res: NextApiResponse
): void {
  if(process.env.BACKEND_URL !== "")
    res.status(200).json({ backendUrl: process.env.BACKEND_URL });
  else
    res.status(500);
}
