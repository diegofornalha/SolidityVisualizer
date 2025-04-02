"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Sparkles, Key, Loader2, AlertTriangle } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Balancer } from "react-wrap-balancer";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import dynamic from 'next/dynamic';
import { CustomizationDropdown } from "./customization-dropdown";
import { exampleRepos } from "~/lib/exampleRepos";
import { ExportDropdown } from "./export-dropdown";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { ApiKeyDialog } from "./api-key-dialog";

interface MainCardProps {
  isHome?: boolean;
  username?: string;
  repo?: string;
  showCustomization?: boolean;
  onModify?: (instructions: string) => void;
  onRegenerate?: (instructions: string) => void;
  onCopy?: () => void;
  lastGenerated?: Date;
  onExportImage?: () => void;
  zoomingEnabled?: boolean;
  onZoomToggle?: () => void;
  loading?: boolean;
}

const MermaidChart = dynamic(() => import('./mermaid-diagram'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-96">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
});

export default function MainCard({
  isHome = true,
  username,
  repo,
  showCustomization,
  onModify,
  onRegenerate,
  onCopy,
  lastGenerated,
  onExportImage,
  zoomingEnabled,
  onZoomToggle,
  loading: initialLoading = false,
}: MainCardProps) {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<
    "customize" | "export" | null
  >(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [diagram, setDiagram] = useState<string | null>(null);
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_key");
    setHasApiKey(!!storedKey);
  }, []);

  useEffect(() => {
    if (loading) {
      setActiveDropdown(null);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasApiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    if (!prompt.trim()) {
      setError("Por favor, digite um prompt para gerar o diagrama");
      return;
    }

    setLoading(true);
    try {
      // Obter a chave da API OpenAI do localStorage
      const apiKey = localStorage.getItem("openai_key");
      
      if (!apiKey) {
        setError("Chave da API OpenAI não encontrada.");
        setLoading(false);
        setShowApiKeyDialog(true);
        return;
      }
      
      // Primeiro gera o diagrama
      const generateResponse = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Erro ao gerar diagrama');
      }

      const { diagram: generatedDiagram } = await generateResponse.json();

      // Validação mais flexível de sintaxe do Mermaid
      const validMermaidSyntax = /flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|graph|mindmap/i.test(generatedDiagram);
      
      let finalDiagram = generatedDiagram;
      if (!validMermaidSyntax) {
        // Verificar se o diagrama está dentro de blocos de código
        const codeBlockMatch = generatedDiagram.match(/```(?:mermaid)?\s*([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          finalDiagram = codeBlockMatch[1].trim();
        } else {
          // Diagrama de fallback mais específico, evitando diagrama genérico
          finalDiagram = `flowchart TD
            A[${title || 'Início'}] --> B[Processamento]
            B --> C{Análise}
            C -->|Positivo| D[Resultado Positivo]
            C -->|Negativo| E[Resultado Negativo]
            D --> F[Conclusão]
            E --> F
            
            style A fill:#bbf,stroke:#33b
            style C fill:#fbb,stroke:#b33
            style F fill:#bbf,stroke:#33b`;
        }
      }

      // Depois salva no banco de dados
      const saveResponse = await fetch('/api/diagrams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          diagram: finalDiagram,
          title: title.trim() || `Diagrama ${new Date().toLocaleDateString('pt-BR')}`
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Erro ao salvar diagrama');
      }

      setDiagram(finalDiagram);
      toast({
        title: 'Sucesso!',
        description: 'Diagrama gerado e salvo com sucesso.',
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar ou salvar o diagrama.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem("openai_key", apiKey);
    setHasApiKey(true);
    setShowApiKeyDialog(false);
  };

  const handleExampleClick = (repoPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(repoPath);
  };

  const handleDropdownToggle = (dropdown: "customize" | "export") => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <Card className="relative w-full max-w-3xl border-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4 shadow-lg sm:p-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!hasApiKey && (
            <div className="mb-4 rounded-md bg-amber-50 p-4 text-amber-800 border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Chave da API OpenAI necessária</h3>
              </div>
              <p className="mt-1 text-sm">
                Para gerar diagramas, você precisa adicionar sua chave da API OpenAI.
              </p>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowApiKeyDialog(true)}
                className="mt-2 border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200"
              >
                <Key className="mr-2 h-4 w-4" />
                Adicionar Chave da API
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Título do Diagrama</Label>
            <Input
              id="title"
              placeholder="Digite um título para o diagrama..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt para Geração</Label>
            <Input
              id="prompt"
              placeholder="Descreva o diagrama que você deseja gerar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className={`gradient-hover rounded-md border-0 p-4 px-4 text-base font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg sm:p-6 sm:px-6 sm:text-lg ${!hasApiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasApiKey || loading}
            onClick={() => {
              if (!hasApiKey) {
                setShowApiKeyDialog(true);
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando diagrama...
              </>
            ) : (
              <>
                <Key className="mr-2 h-5 w-5" />
                Gerar Diagrama
              </>
            )}
          </Button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Example Prompt */}
        {isHome && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700 sm:text-base">
              Experimente nosso exemplo de agente:
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="border-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:from-primary hover:to-secondary focus:ring-2 focus:ring-primary/50 sm:text-base"
                onClick={(e) => handleExampleClick("/agendamento", e)}
              >
                Agente de Agendamento
              </Button>
            </div>
          </div>
        )}

        {/* Dropdowns Container */}
        {!isHome && (
          <div className="space-y-4">
            {!loading && (
              <>
                {/* Buttons Container */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
                  {showCustomization &&
                    onModify &&
                    onRegenerate &&
                    lastGenerated && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle("customize");
                        }}
                        className={`flex items-center justify-between gap-2 rounded-md border-2 border-primary/20 px-4 py-2 font-medium transition-all hover:border-primary/50 hover:shadow-sm sm:max-w-[250px] ${
                          activeDropdown === "customize"
                            ? "bg-primary/10"
                            : "bg-card"
                        }`}
                      >
                        <span>Personalizar</span>
                        {activeDropdown === "customize" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        )}

        {diagram && (
          <div className="mt-6">
            <MermaidChart chart={diagram} />
          </div>
        )}
      </CardContent>

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSubmit={handleApiKeySubmit}
      />

      {/* Decorative Sparkle */}
      <div className="absolute -bottom-8 -left-12 hidden sm:block">
        <Sparkles
          className="h-20 w-20 fill-yellow-400 text-black"
          strokeWidth={0.6}
          style={{ transform: "rotate(-15deg)" }}
        />
      </div>
    </Card>
  );
}
