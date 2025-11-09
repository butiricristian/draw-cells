import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { filename, filetype, presentationId } = await req.json();

    const Key = `video-export-frames/${presentationId}/${Date.now()}-${filename}`;
    const Bucket = process.env.AWS_S3_BUCKET_NAME!;

    // Generate presigned PUT URL
    const command = new PutObjectCommand({
      Bucket,
      Key,
      ContentType: filetype,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 120 }); // valid for 120s

    return NextResponse.json({ url, key: Key });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
