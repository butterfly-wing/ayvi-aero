import "./globals.css";
import { jost } from "@/fonts/jost";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viacheslav — Développeur Full-Stack",
  description:
    "Développeur full-stack orienté architecture, performance et interfaces claires.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={jost.className}>{children}</body>
    </html>
  );
}
