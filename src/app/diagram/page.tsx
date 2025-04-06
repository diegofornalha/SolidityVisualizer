"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiagramPage() {
  const [description, setDescription] = useState<string>("");
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [solidityCode, setSolidityCode] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("diagram");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Carregar dados da sessão anterior do localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedDescription = localStorage.getItem("diagramDescription") || "";
        const savedDiagramCode = localStorage.getItem("diagramCode") || "";
        const savedSolidityCode = localStorage.getItem("solidityCode") || "";
        const savedExplanation = localStorage.getItem("diagramExplanation") || "";

        setDescription(savedDescription);
        setDiagramCode(savedDiagramCode);
        setSolidityCode(savedSolidityCode);
        setExplanation(savedExplanation);
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
      }
    }
  }, []);

  const handleGenerateDiagram = async (newDescription: string, style: string = "simple") => {
    setLoading(true);
    setError("");
    setDescription(newDescription);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/generate-diagram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: newDescription,
          style: style,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao gerar o diagrama");
      }

      const data = await response.json();
      setDiagramCode(data.diagram_code);
      setSolidityCode(data.solidity_code);
      setExplanation(data.explanation);

      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("diagramDescription", newDescription);
          localStorage.setItem("diagramCode", data.diagram_code);
          localStorage.setItem("solidityCode", data.solidity_code);
          localStorage.setItem("diagramExplanation", data.explanation);
        } catch (error) {
          console.error("Erro ao salvar dados no localStorage:", error);
        }
      }

      setActiveTab("diagram");
    } catch (err: any) {
      console.error("Erro:", err);
      setError(err.message || "Ocorreu um erro ao gerar o diagrama");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDiagram = () => {
    // Implementar download do diagrama como SVG ou PNG
    // Isso precisará de uma biblioteca para renderizar o código mermaid como imagem
    alert("Funcionalidade de download em desenvolvimento");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gerador de Diagrama de Contrato Inteligente</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Descreva seu Contrato Inteligente</h2>
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              handleGenerateDiagram(description, "simple");
            }} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Descrição
                </label>
                <textarea
                  id="description"
                  placeholder="Descreva o contrato inteligente que você deseja visualizar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={10}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !description.trim()}
              >
                {loading ? "Gerando..." : "Gerar Diagrama"}
              </Button>
            </form>
          </div>
          {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-base text-slate-600 dark:text-slate-400">Gerando diagrama e código Solidity...</p>
            </div>
          ) : diagramCode ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="diagram" className="flex-1">
                    Diagrama
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex-1">
                    Código Solidity
                  </TabsTrigger>
                  <TabsTrigger value="explanation" className="flex-1">
                    Explicação
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diagram">
                  <div className="p-4 overflow-auto">
                    <pre className="whitespace-pre-wrap">{diagramCode}</pre>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleDownloadDiagram} className="ml-2">
                        Baixar Diagrama
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code">
                  <div className="relative">
                    <pre className="language-solidity p-4 bg-slate-100 dark:bg-slate-900 rounded-md overflow-auto">
                      <code className="text-sm whitespace-pre-wrap">{solidityCode}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="explanation">
                  <div className="prose dark:prose-invert max-w-none p-4">
                    <h3 className="text-xl font-semibold mb-2">Explicação do Contrato</h3>
                    <div className="whitespace-pre-wrap">{explanation}</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-lg text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Insira uma descrição e clique em &quot;Gerar Diagrama&quot; para visualizar o resultado aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
