"use client";

import React, { useState, useEffect } from "react";
import CodeDisplay from "@/components/CodeDisplay";
import DiagramDisplay from "@/components/DiagramDisplay";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage";
import { AlertCircle, BookOpen, Code, Download, BookMarked } from "lucide-react";

export default function VisualizePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [solidityCode, setSolidityCode] = useState<string>("");
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [securityIssues, setSecurityIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const [error, setError] = useState<string>("");
  const [diagramStyle, setDiagramStyle] = useState<string>("flowchart");
  const [includeSecurityAnalysis, setIncludeSecurityAnalysis] = useState<boolean>(true);

  useEffect(() => {
    // Carregar dados da sessão anterior do localStorage
    const savedCode = getFromLocalStorage("solidityCodeToAnalyze", "");
    setSolidityCode(savedCode);
    
    const savedPrompt = getFromLocalStorage("promptToAnalyze", "");
    setPrompt(savedPrompt);
  }, []);

  const handleGenerateDiagram = async () => {
    if (!prompt.trim()) {
      setError("Por favor, descreva o contrato que deseja visualizar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verificar se o usuário forneceu uma chave de API da OpenAI
      const apiKey = getFromLocalStorage("openaiApiKey", "");
      
      if (!apiKey) {
        throw new Error("Por favor, adicione sua chave API nas configurações para gerar o diagrama");
      }

      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          apiKey,
          style: diagramStyle
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar o diagrama");
      }

      const data = await response.json();
      setDiagramCode(data.diagram_code || data.diagram);
      setSolidityCode(data.solidity_code || "");
      setExplanation(data.explanation || "");

      // Salvar no localStorage
      saveToLocalStorage("promptToAnalyze", prompt);
      if (data.solidity_code) {
        saveToLocalStorage("solidityCodeToAnalyze", data.solidity_code);
      }

      setActiveTab("diagram");
      
      // Salvar diagrama na API
      try {
        await fetch("/api/diagramas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            diagram: data.diagram_code || data.diagram,
            title: prompt.substring(0, 100)
          }),
        });
      } catch (saveError) {
        console.error("Erro ao salvar diagrama:", saveError);
        // Não impede o fluxo principal
      }
    } catch (err: any) {
      console.error("Erro:", err);
      setError(err.message || "Ocorreu um erro ao gerar o diagrama");
    } finally {
      setLoading(false);
    }
  };

  const handleDiagramStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiagramStyle(e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const renderExamplePrompts = () => {
    const examples = [
      "Criar um contrato ERC20 básico com funções de mint e burn",
      "Contrato de NFT com royalties para criadores e marketplace",
      "Sistema de staking com recompensas diárias em tokens",
      "Smart contract para um leilão decentralizado",
    ];

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Exemplos de prompts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Visualizador de Contrato Inteligente</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Diagrama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Descreva o contrato que deseja visualizar
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={handlePromptChange}
                  className="h-60"
                  placeholder="Descreva o tipo de contrato que deseja visualizar. Por exemplo: 'Um contrato ERC20 com funções de mint e burn'..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="diagram-style" className="block text-sm font-medium mb-2">
                  Estilo do Diagrama
                </label>
                <select
                  id="diagram-style"
                  value={diagramStyle}
                  onChange={handleDiagramStyleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="flowchart">Fluxograma</option>
                  <option value="sequenceDiagram">Diagrama de Sequência</option>
                  <option value="classDiagram">Diagrama de Classes</option>
                  <option value="erDiagram">Diagrama ER</option>
                </select>
              </div>

              {renderExamplePrompts()}

              <Button 
                onClick={handleGenerateDiagram} 
                disabled={loading} 
                className="w-full mt-4 gradient-hover"
              >
                {loading ? "Gerando..." : "Gerar Diagrama"}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <LoadingState message="Gerando diagrama com base na sua descrição..." />
          ) : diagramCode ? (
            <Card>
              <CardHeader className="pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="diagram" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" /> Diagrama
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" /> Código
                    </TabsTrigger>
                    <TabsTrigger value="explanation" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Explicação
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                <TabsContent value="diagram" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <DiagramDisplay code={diagramCode} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([diagramCode], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `diagrama-${Date.now()}.md`;
                        document.body.appendChild(element);
                        element.click();
                      }}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" /> Baixar Diagrama
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  {solidityCode ? (
                    <CodeDisplay code={solidityCode} language="solidity" />
                  ) : (
                    <div className="p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p>Nenhum código Solidity foi gerado para este diagrama.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="explanation" className="mt-4">
                  <div className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {explanation ? (
                      <div className="whitespace-pre-wrap">{explanation}</div>
                    ) : (
                      <p className="text-center">Nenhuma explicação disponível para este diagrama.</p>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <BookMarked className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhum diagrama gerado</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                Descreva o contrato inteligente que deseja visualizar e clique em "Gerar Diagrama" para criar um diagrama visual.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-md">
                Use linguagem natural para descrever as funcionalidades, entidades e comportamentos do contrato.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Meus Diagramas Recentes</h2>
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/diagramas'}
          >
            Ver Todos os Diagramas
          </Button>
        </div>
      </div>
    </main>
  );
}
