"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a página do diagrama MCPX ao carregar a página inicial
    router.push('/diagrama/mcpx/v0');
  }, [router]);

  // Renderiza um conteúdo mínimo enquanto o redirecionamento ocorre
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-blue-400">
      <p>Redirecionando...</p>
    </div>
  );
}
