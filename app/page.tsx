import React, { Suspense } from "react";
import Home from "../src/Home/components/Home";

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
