"use client";

import React, { useState, useEffect } from "react";
import DiagramGenerator from "@/components/DiagramGenerator";
import DiagramDisplay from "@/components/DiagramDisplay";
import CodeDisplay from "@/components/CodeDisplay";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage";

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
    const savedDescription = getFromLocalStorage("diagramDescription", "");
    const savedDiagramCode = getFromLocalStorage("diagramCode", "");
    const savedSolidityCode = getFromLocalStorage("solidityCode", "");
    const savedExplanation = getFromLocalStorage("diagramExplanation", "");

    setDescription(savedDescription);
    setDiagramCode(savedDiagramCode);
    setSolidityCode(savedSolidityCode);
    setExplanation(savedExplanation);
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
      saveToLocalStorage("diagramDescription", newDescription);
      saveToLocalStorage("diagramCode", data.diagram_code);
      saveToLocalStorage("solidityCode", data.solidity_code);
      saveToLocalStorage("diagramExplanation", data.explanation);

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
          <DiagramGenerator
            onGenerate={handleGenerateDiagram}
            initialDescription={description}
            isLoading={loading}
          />
          {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <LoadingState message="Gerando diagrama e código Solidity..." />
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
                  <DiagramDisplay code={diagramCode} />
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleDownloadDiagram} className="ml-2">
                      Baixar Diagrama
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="code">
                  <CodeDisplay code={solidityCode} language="solidity" />
                </TabsContent>

                <TabsContent value="explanation">
                  <div className="prose dark:prose-invert max-w-none">
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
