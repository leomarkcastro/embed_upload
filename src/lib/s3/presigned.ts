import { Client } from "minio";

const client = new Client({
  endPoint: "file-asia-se-01-api.db.srv01.xyzapps.xyz",
  accessKey: "XgINBhIQbVqlEOUR",
  secretKey: "VEGpqq54DmIFBpgSW7TlQkjLQcjPAOnG",
});

export const getPresignedUrl = async (
  objectName: string,
  expiry: number = 24 * 60 * 60
): Promise<string> => {
  const url = await client.presignedPutObject("tests", objectName, expiry);
  return url;
};
