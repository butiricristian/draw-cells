"use client";

import { get, ref } from "firebase/database";
import React, { useEffect } from "react";
import { db } from "../../../../src/firebase-config";
import dynamic from "next/dynamic";

const PresentationContainer = dynamic(
  () => import("../../../../src/Presentation/components/PresentationContainer"),
  { ssr: false }
);

const PresentationPage = async ({ params }: { params: { id: string } }) => {
  return <PresentationContainer presentationId={params.id} />;
};

export default PresentationPage;
