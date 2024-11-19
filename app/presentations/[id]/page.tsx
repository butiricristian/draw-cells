"use client";

import { get, ref } from "firebase/database";
import React, { useEffect } from "react";
import { db } from "../../../src/firebase-config";
import dynamic from "next/dynamic";

const AnimationCanvasContainer = dynamic(
  () => import("../../../src/Canvas/components/AnimationCanvas"),
  { ssr: false }
);

const CanvasPage = async ({ params }: { params: { id: string } }) => {
  return <AnimationCanvasContainer />;
};

export default CanvasPage;
