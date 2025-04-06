import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileCode, ExternalLink, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col items-center justify-center space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fadeIn">
            Visualizador de Contrato Inteligente
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforme sua ideia de contrato inteligente em diagramas visuais detalhados usando IA
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild size="lg" className="gradient-hover">
              <Link href="/visualizar">
                <Code className="mr-2 h-5 w-5" /> Iniciar agora
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle>Descrição em Linguagem Natural</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Descreva seu contrato inteligente como se estivesse conversando com um especialista. Nossa IA entende o que você precisa.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle>Geração de Diagramas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Receba diagramas claros e profissionais que ilustram a estrutura, fluxo de dados e lógica do seu contrato inteligente.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle>Código Solidity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Obtenha o código Solidity completo do seu contrato, pronto para ser implantado ou modificado conforme suas necessidades.</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full max-w-5xl bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Por que usar o Visualizador de Contrato Inteligente?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <span>Facilita a compreensão de contratos complexos através de visualizações claras</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <span>Acelera o processo de desenvolvimento e documentação de smart contracts</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <span>Identificação de potenciais problemas de segurança antes da implementação</span>
            </li>
          </ul>
        </div>

        <Button asChild variant="outline" className="mt-8">
          <Link href="/visualizar">
            Começar a usar <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
