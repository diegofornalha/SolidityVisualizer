import './globals.css';
import { Inter } from 'next/font/google';
import FlowpixLogo from './components/FlowpixLogo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FLOWPIX - Solidity Visualizer',
  description: 'Create agent diagrams with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <FlowpixLogo />
        {children}
      </body>
    </html>
  );
}
