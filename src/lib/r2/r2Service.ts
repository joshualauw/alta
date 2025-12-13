import config from "@/config";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl as getAwsSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetPresignedUrlParams } from "./types/GetPresignedUrl";
import { GetFileContentParams } from "./types/GetFileContent";
import { InternalServerError } from "@/lib/internal/errors";

const S3 = new S3Client({
    region: "auto",
    endpoint: config.R2_ENDPOINT,
    credentials: {
        accessKeyId: config.R2_ACCESS_KEY,
        secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
});

export async function getPresignedUrl({ objectKey, contentType, expiresIn = 1500 }: GetPresignedUrlParams): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: config.R2_BUCKET_NAME,
        Key: objectKey,
        ContentType: contentType
    });
    return getAwsSignedUrl(S3, command, { expiresIn });
}

export async function getFileContent({ objectKey }: GetFileContentParams): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: config.R2_BUCKET_NAME,
        Key: objectKey
    });

    const response = await S3.send(command);
    if (!response.Body) throw new InternalServerError("response body not found");

    return response.Body.transformToString();
}
