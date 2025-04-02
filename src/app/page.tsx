"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { DiagramaZoom } from "./diagramas/diagrama-zoom";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramCode, setDiagramCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) {
      toast({
        title: "Erro",
        description: "Por favor, digite um prompt.",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave da API do OpenAI.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      setIsLoading(true);
      
      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          apiKey,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao gerar o diagrama.");
      }
      
      const data = await response.json();
      setDiagramCode(data.diagram);
      
      // Salvar o diagrama no banco de dados
      await fetch("/api/diagramas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          diagram: data.diagram,
        }),
      });
      
      toast({
        title: "Sucesso!",
        description: "Diagrama gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar diagrama:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao gerar o diagrama.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Flow Agents - Gerador de Diagramas
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Diagramas</CardTitle>
            <CardDescription>
              Descreva o diagrama que você deseja gerar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Descrição do Diagrama</Label>
                <Input
                  id="prompt"
                  placeholder="Digite seu prompt aqui para gerar um diagrama..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24"
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">Chave da API OpenAI</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar Diagrama"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Diagrama</CardTitle>
            <CardDescription>
              O diagrama gerado será exibido aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : diagramCode ? (
              <DiagramaZoom codigo={diagramCode} titulo={prompt} />
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  Nenhum diagrama gerado ainda. Preencha o formulário ao lado e clique em "Gerar Diagrama".
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Desenvolvido com tecnologia GPT-4 para transformar texto em diagramas Mermaid.
        </p>
        <div className="mt-2">
          <a
            href="/diagramas"
            className="text-blue-500 hover:text-blue-700 underline text-sm"
          >
            Ver meus diagramas salvos
          </a>
        </div>
      </div>
    </main>
  );
}
