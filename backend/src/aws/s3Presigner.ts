import s3 from "src/aws/s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Return a time-limited URL that lets anyone read the object.
 * @param key  The S3 object key, e.g. "logos/uuid.jpg"
 * @param ttl  Lifetime in seconds (default 1 h)
 */
export const getLogoUrl = async (
  key: string,
  ttl = 60 * 60,
): Promise<string> => {
  if (!key) throw new Error("Missing object key");
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: ttl });
};
