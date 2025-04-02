import "../styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { Nav } from "~/components/nav";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "FlowAgents - Gerador de Diagramas",
  description: "Gere diagramas a partir de prompts em português.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Nav />
          <div className="flex-1">{children}</div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
