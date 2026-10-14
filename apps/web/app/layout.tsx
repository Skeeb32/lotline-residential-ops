import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotline | Residential portfolio operations",
  description: "A clear operating picture for every residential asset.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
