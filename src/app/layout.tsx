import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { CSPostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Solidity Git Diagram",
  description:
    "Turn any Solidity smart contract repository into an interactive diagram for visualization in seconds.",
  metadataBase: new URL("https://solidityVisualizer.com"),
  keywords: [
    "solidity",
    "smart contracts",
    "ethereum",
    "blockchain",
    "smart contract diagram",
    "solidity diagram generator",
    "solidity diagram tool",
    "solidity diagram maker",
    "solidity diagram creator",
    "diagram",
    "repository",
    "visualization",
    "code structure",
    "system design",
    "smart contract architecture",
    "smart contract design",
    "blockchain engineering",
    "blockchain development",
    "defi",
    "web3",
    "open source",
    "open source software",
    "solidity visualizer",
  ],
  authors: [
    { name: "Ahmed Khaleel", url: "https://github.com/VGabriel45" },
  ],
  creator: "Ahmed Khaleel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://solidityVisualizer.com",
    title: "Solidity Visualizer - Smart Contract Diagrams in Seconds",
    description:
      "Turn any Solidity smart contract repository into an interactive diagram for visualization.",
    siteName: "Solidity Visualizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Solidity Visualizer - Smart Contract Visualization Tool",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <CSPostHogProvider>
        <body className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
