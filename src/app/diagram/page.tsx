"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '~/components/ui/card';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useToast } from '~/components/ui/use-toast';

const MermaidChart = dynamic(() => import('~/components/mermaid-diagram'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-96">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
});

export default function DiagramPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const [loading, setLoading] = useState(true);
  const [diagram, setDiagram] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrGenerateDiagram = async () => {
      if (!prompt) return;

      try {
        // Primeiro tenta buscar do banco de dados
        const response = await fetch(`/api/diagrams/by-prompt?prompt=${encodeURIComponent(prompt)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.diagram) {
            setDiagram(data.diagram);
            return;
          }
        }

        // Se não encontrou no banco, gera um novo
        const generateResponse = await fetch('/api/generate-diagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (!generateResponse.ok) {
          throw new Error('Erro ao gerar diagrama');
        }

        const { diagram: generatedDiagram } = await generateResponse.json();

        // Salva o novo diagrama no banco
        await fetch('/api/diagrams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            diagram: generatedDiagram,
            title: 'Diagrama gerado via URL'
          })
        });

        setDiagram(generatedDiagram);
      } catch (error) {
        console.error('Erro:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar ou gerar o diagrama.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateDiagram();
  }, [prompt, toast]);

  if (!prompt) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhum prompt fornecido. Por favor, adicione um prompt na URL.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          {diagram ? (
            <MermaidChart chart={diagram} />
          ) : (
            <p className="text-center text-muted-foreground">
              Não foi possível carregar o diagrama.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 