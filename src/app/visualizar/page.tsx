"use client";

import React, { useState, useEffect } from "react";
import CodeDisplay from "@/components/CodeDisplay";
import DiagramDisplay from "@/components/DiagramDisplay";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage";

export default function VisualizePage() {
  const [solidityCode, setSolidityCode] = useState<string>("");
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [securityIssues, setSecurityIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const [error, setError] = useState<string>("");
  const [includeSecurityAnalysis, setIncludeSecurityAnalysis] = useState<boolean>(true);

  useEffect(() => {
    // Carregar código Solidity da sessão anterior do localStorage
    const savedCode = getFromLocalStorage("solidityCodeToAnalyze", "");
    setSolidityCode(savedCode);
  }, []);

  const handleAnalyze = async () => {
    if (!solidityCode.trim()) {
      setError("Por favor, insira o código Solidity para analisar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/analyze-contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solidity_code: solidityCode,
          include_security_analysis: includeSecurityAnalysis,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao analisar o contrato");
      }

      const data = await response.json();
      setDiagramCode(data.diagram_code);
      setExplanation(data.explanation);
      setSecurityIssues(data.security_issues || []);

      // Salvar no localStorage
      saveToLocalStorage("solidityCodeToAnalyze", solidityCode);

      setActiveTab("diagram");
    } catch (err: any) {
      console.error("Erro:", err);
      setError(err.message || "Ocorreu um erro ao analisar o contrato");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolidityCode(e.target.value);
  };

  const renderSecurityIssues = () => {
    if (securityIssues.length === 0) {
      return (
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md">
          <p className="text-green-800 dark:text-green-200">Nenhum problema de segurança identificado.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Problemas de Segurança Identificados</h3>
        {securityIssues.map((issue, index) => (
          <div key={index} className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-md">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">{issue.title}</h4>
            <p className="mt-1 text-amber-700 dark:text-amber-300">{issue.description}</p>
            {issue.line_number && (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                Linha: {issue.line_number}
              </p>
            )}
            {issue.recommendation && (
              <div className="mt-2">
                <p className="font-medium text-amber-800 dark:text-amber-200">Recomendação:</p>
                <p className="text-amber-700 dark:text-amber-300">{issue.recommendation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Visualizador de Contrato Inteligente</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="solidity-code" className="block text-sm font-medium mb-2">
              Código Solidity
            </label>
            <Textarea
              id="solidity-code"
              value={solidityCode}
              onChange={handleCodeChange}
              className="font-mono h-96"
              placeholder="Cole seu código Solidity aqui..."
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="security-analysis"
              checked={includeSecurityAnalysis}
              onChange={(e) => setIncludeSecurityAnalysis(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="security-analysis" className="ml-2 block text-sm">
              Incluir análise de segurança
            </label>
          </div>

          <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? "Analisando..." : "Analisar Contrato"}
          </Button>

          {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
        </div>

        <div>
          {loading ? (
            <LoadingState message="Analisando o contrato e gerando diagrama..." />
          ) : diagramCode ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="diagram" className="flex-1">
                    Diagrama
                  </TabsTrigger>
                  <TabsTrigger value="explanation" className="flex-1">
                    Explicação
                  </TabsTrigger>
                  {includeSecurityAnalysis && (
                    <TabsTrigger value="security" className="flex-1">
                      Segurança
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="diagram">
                  <DiagramDisplay code={diagramCode} />
                </TabsContent>

                <TabsContent value="explanation">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-2">Análise do Contrato</h3>
                    <div className="whitespace-pre-wrap">{explanation}</div>
                  </div>
                </TabsContent>

                {includeSecurityAnalysis && (
                  <TabsContent value="security">{renderSecurityIssues()}</TabsContent>
                )}
              </Tabs>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-lg text-center h-full flex items-center justify-center">
              <p className="text-slate-600 dark:text-slate-400">
                Cole seu código Solidity e clique em &quot;Analisar Contrato&quot; para visualizar o diagrama e
                análise.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
