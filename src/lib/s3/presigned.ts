import { Client, ClientOptions } from "minio";

const ClientOpts: ClientOptions = {
  accessKey: process.env.S3_ACCESS_KEY ?? "",
  secretKey: process.env.S3_SECRET_KEY ?? "",
  endPoint: process.env.S3_ENDPOINT ?? "",
};

const client = new Client(ClientOpts);

export const getPresignedUrl = async (
  objectName: string,
  expiry: number = 24 * 60 * 60
): Promise<string> => {
  const url = await client.presignedPutObject("tests", objectName, expiry);
  return url;
};
