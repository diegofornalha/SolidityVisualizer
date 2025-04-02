'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '~/components/ui/use-toast';
import { DiagramaZoom } from './diagrama-zoom';

// Função para formatar data com segurança
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Data não disponível";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data não disponível";
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data não disponível";
  }
};

interface Diagrama {
  id: string;
  prompt: string;
  diagram: string;
  createdAt: string;
}

export default function DiagramasPage() {
  const [diagramas, setDiagramas] = useState<Diagrama[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function carregarDiagramas() {
      try {
        setCarregando(true);
        const response = await fetch("/api/diagramas");
        
        if (!response.ok) {
          throw new Error("Falha ao carregar diagramas");
        }
        
        const data = await response.json();
        
        // Mapear dados do servidor para o formato esperado
        const diagramasFormatados = data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(36).substring(2),
          prompt: item.prompt || "Sem descrição",
          diagram: item.diagram || "",
          createdAt: item.created_at || item.createdAt || new Date().toISOString()
        }));
        
        setDiagramas(diagramasFormatados);
      } catch (error) {
        console.error("Erro ao carregar diagramas:", error);
        setErro(error instanceof Error ? error.message : "Ocorreu um erro ao carregar os diagramas.");
      } finally {
        setCarregando(false);
      }
    }
    
    carregarDiagramas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/diagramas?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir diagrama");
      }

      setDiagramas(diagramas.filter(d => d.id !== id));
      toast({
        title: "Sucesso",
        description: "Diagrama excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o diagrama.",
        variant: "destructive"
      });
    }
  };

  if (carregando) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <h1 className="text-2xl font-bold">Seus Diagramas</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <h1 className="text-2xl font-bold">Seus Diagramas</h1>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <h3 className="font-semibold">Erro ao carregar diagramas</h3>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  if (diagramas.length === 0) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <h1 className="text-2xl font-bold">Seus Diagramas</h1>
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum diagrama encontrado</h3>
          <p className="text-gray-500">
            Gere um novo diagrama na página inicial para visualizá-lo aqui.
          </p>
        </div>
      </div>
    );
  }

  // Ordenar diagramas do mais recente para o mais antigo
  const diagramasOrdenados = [...diagramas].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Diagramas</h1>
      
      <div className="grid gap-8 md:grid-cols-1">
        {diagramasOrdenados.map((diagrama) => (
          <Card key={diagrama.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{diagrama.prompt}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(diagrama.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(diagrama.createdAt)}
              </p>
            </CardHeader>
            <CardContent>
              <DiagramaZoom codigo={diagrama.diagram} titulo={diagrama.prompt} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 