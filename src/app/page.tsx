import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <div className="flex flex-col items-center justify-between p-24">
        <h1>SolidityVisualizer</h1>
        <p>Bem-vindo ao visualizador de contratos Solidity.</p>
        
        <div className="flex gap-4 mt-8">
          <Link href="/visualizar" className="gradient-hover">
            Visualizar Contratos
          </Link>
        </div>
      </div>
    </main>
  );
}
