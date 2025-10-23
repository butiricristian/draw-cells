import { NextRequest, NextResponse } from "next/server";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.frames)) {
      return NextResponse.json(
        { error: "Invalid frames array" },
        { status: 400 }
      );
    }

    const invoke = new InvokeCommand({
      FunctionName: process.env.LAMBDA_FUNCTION_NAME!, // e.g., "ffmpeg-images-to-video"
      InvocationType: "RequestResponse",
      Payload: Buffer.from(
        JSON.stringify({ body: JSON.stringify(body), isBase64Encoded: false })
      ),
    });

    const resp = await lambdaClient.send(invoke);

    if (!resp.Payload) {
      return NextResponse.json(
        { error: "Empty Lambda response" },
        { status: 502 }
      );
    }

    const payloadStr = Buffer.from(resp.Payload as Uint8Array).toString(
      "utf-8"
    );
    const payload = JSON.parse(payloadStr);
    console.log("[lambda-payload]", payload);

    // If your Lambda returns the MP4 directly (base64)
    if (
      payload.headers?.["Content-Type"] === "video/mp4" &&
      payload.isBase64Encoded
    ) {
      const buf = Buffer.from(payload.body, "base64");
      return new NextResponse(buf, {
        status: payload.statusCode || 200,
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": "attachment; filename=animation.mp4",
        },
      });
    }

    // Otherwise, just forward JSON (e.g., {status, bucket, key, url?})
    return NextResponse.json(
      typeof payload.body === "string"
        ? JSON.parse(payload.body)
        : payload.body,
      { status: payload.statusCode || 200 }
    );
  } catch (error: any) {
    console.error("[ffmpeg-error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
