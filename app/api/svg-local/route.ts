// app/api/svg-local/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SPRITE_TO_SVG_ELEMENT_MAP } from "../../../src/constants";
// import { JSDOM } from "jsdom";
// import createDOMPurify from "dompurify";

export const runtime = "nodejs"; // ensure Node runtime for fs access

// Put your SVGs under /public/svg (recommended)
const BASE_DIR = path.join(process.cwd(), "public", "assets", "cells");

// function sanitizeSvg(svg: string) {
//   const window = new JSDOM("").window as unknown as Window;
//   const DOMPurify = createDOMPurify(window);

//   return DOMPurify.sanitize(svg, {
//     USE_PROFILES: { svg: true, svgFilters: true },
//     ALLOWED_URI_REGEXP: /^data:image\/|^#$|^$|^(?!javascript:)/i,
//     FORBID_TAGS: ["script", "iframe", "foreignObject"],
//     FORBID_ATTR: ["onload", "onerror", "onclick", "style"],
//     KEEP_CONTENT: false,
//   }) as string;
// }

function postProcess(svg: string) {
  return svg.replace(/(<svg\b[^>]*)(>)/i, (_m, a, b) => {
    let attrs = a;
    if (!/\bfill=/i.test(attrs)) attrs += ' fill="currentColor"';
    attrs = attrs.replace(/\s(width|height)="[^"]*"/gi, "");
    return `${attrs}${b}`;
  });
}

function normalizeSvg(s: string) {
  return s
    .replace(/^\s*<\?xml[^>]*>\s*/i, "") // drop XML prolog
    .replace(/^\s*<!DOCTYPE[^>]*>\s*/i, ""); // drop DOCTYPE
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const fileName = SPRITE_TO_SVG_ELEMENT_MAP[name];
  const variant = searchParams.get("variant") || fileName.variants?.[0] || "";

  if (!fileName) {
    return NextResponse.json({ error: "Unknown SVG name" }, { status: 404 });
  }

  // Resolve path safely inside BASE_DIR
  const filePath = path.join(
    BASE_DIR,
    fileName.category,
    `${fileName.name}${variant ? " - " + variant : ""}.svg`
  );
  if (!filePath.startsWith(BASE_DIR)) {
    console.log("Invalid path attempt:", filePath);
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  let rawSvg: string;
  try {
    rawSvg = await fs.readFile(filePath, "utf8");
  } catch {
    console.log("File not found:", filePath);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  console.log("Loaded SVG file:", rawSvg.slice(0, 100));

  if (!normalizeSvg(rawSvg).trim().startsWith("<svg")) {
    console.log("Invalid SVG:", filePath);
    return NextResponse.json({ error: "Invalid SVG" }, { status: 400 });
  }

  // const sanitized = sanitizeSvg(rawSvg);
  const finalSvg = postProcess(rawSvg);

  return new NextResponse(finalSvg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
