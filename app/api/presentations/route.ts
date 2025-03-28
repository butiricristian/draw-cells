"use server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { googlePresentationId } = await req.json();
  return NextResponse.json({
    message: `Received presentation id: ${googlePresentationId}`,
  });
}
