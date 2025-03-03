import "../styles/globals.css";

import React from "react";
import App from "../src/App";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Using layout");

  return (
    <html lang="en">
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
