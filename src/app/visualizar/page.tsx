"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { formatDiagramCode } from "~/lib/format-diagram";
import { useToast } from "~/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Carregar o componente MermaidChart dinamicamente sem SSR
const MermaidChart = dynamic(() => import("~/components/mermaid-diagram"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[300px] bg-gray-100 rounded-lg">
      <p className="text-gray-500">Carregando visualizador de diagrama...</p>
    </div>
  ),
});

export default function VisualizarPage() {
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [formattedCode, setFormattedCode] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);
  const { toast } = useToast();

  // Efeito para verificar se há código armazenado no localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem("diagramCode");
    if (savedCode) {
      setDiagramCode(savedCode);
    } else {
      // Exemplo padrão se não houver código salvo
      setDiagramCode(
        `flowchart LR
  subgraph Módulo_de_Contabilidade
    style Módulo_de_Contabilidade fill:#bbf,stroke:#33b
    Registro_de_Transações --> Plano_de_Contas
    Plano_de_Contas --> Relatórios_Contábeis
  end
  
  subgraph Módulo_de_Faturamento
    style Módulo_de_Faturamento fill:#bfb,stroke:#3b3
    Notas_Fiscais --> Contas_a_Receber
    Contas_a_Receber --> Pagamentos
  end
  
  subgraph Módulo_de_Orçamento
    style Módulo_de_Orçamento fill:#fbb,stroke:#b33
    Planejamento --> Controle_de_Despesas
    Controle_de_Despesas --> Análise_de_Variações
  end
  
  subgraph Módulo_de_Relatórios
    style Módulo_de_Relatórios fill:#9f9,stroke:#3b3
    Dashboard --> Demonstrativos
    Demonstrativos --> Análises
  end
  
  Relatórios_Contábeis --> Dashboard
  Pagamentos --> Dashboard
  Análise_de_Variações --> Dashboard`
      );
    }
  }, []);

  // Função para formatar e renderizar o diagrama
  const handleRender = () => {
    try {
      setIsRendering(true);
      const formatted = formatDiagramCode(diagramCode);
      setFormattedCode(formatted);
      
      // Salvar no localStorage
      localStorage.setItem("diagramCode", diagramCode);
      
      toast({
        title: "Diagrama renderizado",
        description: "O diagrama foi formatado e renderizado com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erro ao formatar diagrama:", error);
      toast({
        title: "Erro ao renderizar diagrama",
        description: "Verifique a sintaxe do seu código Mermaid.",
        variant: "destructive",
      });
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Visualizador de Diagramas Mermaid</h1>
      
      <Tabs defaultValue="editor">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Visualização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Código do Diagrama</h2>
            <p className="text-gray-600 mb-4">
              Cole ou escreva o código Mermaid abaixo. Certifique-se de que a sintaxe esteja correta.
            </p>
            
            <Textarea
              value={diagramCode}
              onChange={(e) => setDiagramCode(e.target.value)}
              className="w-full h-64 font-mono text-sm"
              placeholder="Digite ou cole o código Mermaid aqui..."
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleRender} 
                disabled={isRendering || !diagramCode.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRendering ? "Renderizando..." : "Renderizar Diagrama"}
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Dicas para sintaxe Mermaid</h3>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>Use <code className="bg-gray-100 p-1 rounded text-sm">flowchart TD</code> para diagrama de cima para baixo</li>
              <li>Use <code className="bg-gray-100 p-1 rounded text-sm">flowchart LR</code> para diagrama da esquerda para direita</li>
              <li>Conecte nós com <code className="bg-gray-100 p-1 rounded text-sm">A --> B</code></li>
              <li>Agrupes nós com <code className="bg-gray-100 p-1 rounded text-sm">subgraph Nome ... end</code></li>
              <li>Estilize elementos com <code className="bg-gray-100 p-1 rounded text-sm">style A fill:#f9f,stroke:#333</code></li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Visualização do Diagrama</h2>
            
            {formattedCode ? (
              <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] bg-gray-50">
                <MermaidChart chart={formattedCode} zoomingEnabled={true} />
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">
                  Clique em "Renderizar Diagrama" na aba Editor para visualizar seu diagrama aqui.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 