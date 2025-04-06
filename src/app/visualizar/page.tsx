"use client";

import React, { useState, useEffect } from "react";
import CodeDisplay from "@/components/CodeDisplay";
import DiagramDisplay from "@/components/DiagramDisplay";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage";
import { AlertCircle, BookOpen, Code, Download, BookMarked, Sparkles, Info, FileCode } from "lucide-react";

export default function VisualizePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [solidityCode, setSolidityCode] = useState<string>("");
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [securityIssues, setSecurityIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("diagram");
  const [error, setError] = useState<string>("");
  const [diagramStyle, setDiagramStyle] = useState<string>("flowchart");
  const [includeSecurityAnalysis, setIncludeSecurityAnalysis] = useState<boolean>(true);

  useEffect(() => {
    // Carregar dados da sessão anterior do localStorage
    const savedCode = getFromLocalStorage("solidityCodeToAnalyze", "");
    if (savedCode) setSolidityCode(savedCode);
    
    const savedPrompt = getFromLocalStorage("promptToAnalyze", "");
    if (savedPrompt) setPrompt(savedPrompt);

    const savedDiagram = getFromLocalStorage("savedDiagram", "");
    if (savedDiagram) setDiagramCode(savedDiagram);

    const savedExplanation = getFromLocalStorage("savedExplanation", "");
    if (savedExplanation) setExplanation(savedExplanation);
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
      const newDiagramCode = data.diagram_code || data.diagram;
      const newSolidityCode = data.solidity_code || "";
      const newExplanation = data.explanation || "";
      
      setDiagramCode(newDiagramCode);
      setSolidityCode(newSolidityCode);
      setExplanation(newExplanation);

      // Salvar no localStorage
      saveToLocalStorage("promptToAnalyze", prompt);
      saveToLocalStorage("savedDiagram", newDiagramCode);
      saveToLocalStorage("savedExplanation", newExplanation);
      
      if (newSolidityCode) {
        saveToLocalStorage("solidityCodeToAnalyze", newSolidityCode);
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
            diagram: newDiagramCode,
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

  const handleDiagramStyleChange = (value: string) => {
    setDiagramStyle(value);
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
      <div className="space-y-3 mt-6">
        <h3 className="text-sm font-medium">Exemplos de prompts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setPrompt(example)}
              className="h-auto py-2 justify-start text-left font-normal"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Visualizador de Contrato Inteligente
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Descreva seu contrato inteligente em linguagem natural e receba um diagrama visual, código e explicação detalhada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border-border hover:border-primary/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" /> Gerar Diagrama
              </CardTitle>
              <CardDescription>
                Descreva o contrato que você deseja visualizar em detalhes
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  className="h-60 resize-none focus-visible:ring-primary"
                  placeholder="Descreva o tipo de contrato que deseja visualizar. Por exemplo: 'Um contrato ERC20 com funções de mint e burn'..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estilo do Diagrama</label>
                <Select value={diagramStyle} onValueChange={handleDiagramStyleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estilo do diagrama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowchart">Fluxograma</SelectItem>
                    <SelectItem value="sequenceDiagram">Diagrama de Sequência</SelectItem>
                    <SelectItem value="classDiagram">Diagrama de Classes</SelectItem>
                    <SelectItem value="erDiagram">Diagrama ER</SelectItem>
                  </SelectContent>
                </Select>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground mt-1 cursor-help">
                        <Info className="h-3 w-3 mr-1" /> Escolha o estilo que melhor representa seu contrato
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Fluxogramas são bons para lógica, diagramas de classe para estrutura, e diagramas de sequência para interações entre componentes.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {renderExamplePrompts()}

              <Button 
                onClick={handleGenerateDiagram} 
                disabled={loading} 
                className="w-full mt-2 gradient-hover"
                size="lg"
              >
                {loading ? "Gerando..." : "Gerar Diagrama"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <LoadingState message="Gerando diagrama com base na sua descrição..." />
            </Card>
          ) : diagramCode ? (
            <Card className="shadow-sm border-border overflow-hidden">
              <CardHeader className="pb-0 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="diagram" className="flex items-center">
                      <FileCode className="h-4 w-4 mr-2" /> Diagrama
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

              <CardContent className="p-0">
                <TabsContent value="diagram" className="m-0 p-0">
                  <div className="p-6 bg-card">
                    <DiagramDisplay code={diagramCode} />
                  </div>
                  <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
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

                <TabsContent value="code" className="m-0">
                  {solidityCode ? (
                    <div className="p-0">
                      <CodeDisplay code={solidityCode} language="solidity" />
                      <div className="px-6 py-4 border-t bg-muted/20 flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([solidityCode], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = `contrato-${Date.now()}.sol`;
                            document.body.appendChild(element);
                            element.click();
                          }}
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2" /> Baixar Código
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">Nenhum código gerado para este contrato.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="explanation" className="m-0 p-6">
                  {explanation ? (
                    <div className="prose prose-primary dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground">Nenhuma explicação disponível para este contrato.</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          ) : (
            <Card className="min-h-[500px] flex flex-col items-center justify-center border-dashed border-2 border-muted bg-muted/20">
              <div className="max-w-md text-center p-8 space-y-4">
                <h2 className="text-xl font-semibold">Nenhum diagrama gerado</h2>
                <p className="text-muted-foreground">
                  Descreva o contrato inteligente que deseja visualizar e clique em "Gerar Diagrama" para criar um diagrama visual.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use linguagem natural para descrever as funcionalidades, entidades e comportamentos do contrato.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Meus Diagramas Recentes</h2>
        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/diagramas">Ver Todos os Diagramas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} {...props}>{children}</a>;
}
