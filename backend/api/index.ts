// Explicitly tell module-alias where to find package.json in backend directory
// @ts-expect-error - module-alias doesn't have types
import moduleAlias from "module-alias";
moduleAlias(require.resolve("../package.json"));
import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../src/app";

const uri = process.env.MONGODB_URI!;

declare global {
  // eslint-disable-next-line no-var
  var __mongooseReady: Promise<typeof mongoose> | undefined;
}

function connectMongoose() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (mongoose.connection.readyState === 2)
    return mongoose.connection.asPromise();
  if (!global.__mongooseReady) {
    global.__mongooseReady = mongoose.connect(uri);
  }
  return global.__mongooseReady;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectMongoose();
  return app(req, res);
}
