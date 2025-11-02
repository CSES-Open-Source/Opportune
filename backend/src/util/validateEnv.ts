/**
 * Parses .env parameters and ensures they are of required types. If any .env parameters are
 * missing, the server will not start and an error will be thrown.
 */

import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port({ default: 3500 }), // Optional: defaults to 3500 for local dev, Vercel ignores this
  MONGODB_URI: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  AWS_BUCKET_NAME: str(), // Required for S3 uploads and presigned URLs
});
