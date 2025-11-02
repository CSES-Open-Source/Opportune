import "module-alias/register";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "src/app";

const uri = process.env.MONGODB_URI!;

declare global {
  // eslint-disable-next-line no-var
  var __mongooseReady: Promise<typeof mongoose> | undefined;
}

function connectMongoose() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (mongoose.connection.readyState === 2)
    return mongoose.connection.asPromise();
  if (!global.__mongooseReady) global.__mongooseReady = mongoose.connect(uri);
  return global.__mongooseReady;
}

export default async function handler(
  _req: VercelRequest,
  _res: VercelResponse,
) {
  await connectMongoose();
  return (
    app as unknown as (_req: VercelRequest, _res: VercelResponse) => void
  )(_req, _res);
}
