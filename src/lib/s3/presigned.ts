import { Client, ClientOptions } from "minio";

const ClientOpts: ClientOptions = {
  accessKey: process.env.S3_ACCESS_KEY ?? "",
  secretKey: process.env.S3_SECRET_KEY ?? "",
  endPoint: process.env.S3_ENDPOINT ?? "",
  region: process.env.S3_REGION ?? "",
};

const BUCKET_NAME = process.env.S3_BUCKET_NAME ?? "";
const PREFIX = process.env.S3_PATH_PREFIX ?? "";

const client = new Client(ClientOpts);

export const getPresignedUrl = async (
  objectName: string,
  expiry: number = 24 * 60 * 60
): Promise<string> => {
  const url = await client.presignedPutObject(
    BUCKET_NAME,
    PREFIX + objectName,
    expiry
  );
  return url;
};
