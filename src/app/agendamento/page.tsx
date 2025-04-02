"use client";

import dynamic from "next/dynamic";

// Importar o MermaidChart específico para esta página com carregamento dinâmico
const MermaidChart = dynamic(() => import("./mermaid-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[600px] flex items-center justify-center">
      <div className="animate-pulse">Carregando visualizador de diagramas...</div>
    </div>
  ),
});

export default function AgendamentoPage() {
  // Ajustado o diagrama para ser mais completo e visível
  const diagramCode = `
sequenceDiagram
    autonumber
    participant User as Usuário
    participant Chat as Chat Trigger
    participant AI as AI Agent
    participant Calendar as Google Calendar
    
    User ->> Chat: Envia mensagem
    Chat ->> AI: Processa mensagem
    AI ->> Calendar: Verifica disponibilidade
    Calendar -->> AI: Horários disponíveis
    AI ->> User: Propõe horários
    User ->> Chat: Confirma horário
    Chat ->> AI: Processa confirmação
    AI ->> Calendar: Criar evento
    Calendar -->> AI: Evento criado
    AI -->> User: Confirma agendamento
    
    Note over User,Calendar: Agendamento concluído
    
    User ->> Chat: Solicita listagem
    Chat ->> AI: Processa solicitação
    AI ->> Calendar: Consultar eventos
    Calendar -->> AI: Lista de eventos
    AI -->> User: Mostra agenda
    
    User ->> Chat: Solicita cancelamento
    Chat ->> AI: Processa solicitação
    AI ->> Calendar: Deletar evento
    Calendar -->> AI: Evento deletado
    AI -->> User: Confirma cancelamento
  `;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sistema de Agendamento</h1>
      
      {/* Layout em duas colunas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Coluna do Diagrama - Altura automática para exibir conteúdo completo */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-lg p-6 overflow-visible">
          <h2 className="text-2xl font-semibold mb-4">Diagrama do Sistema</h2>
          <div className="overflow-visible">
            <MermaidChart chart={diagramCode} zoomingEnabled={false} />
          </div>
        </div>
        
        {/* Coluna dos Componentes - Com altura ajustável */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6 self-start sticky top-4">
          <h2 className="text-2xl font-semibold mb-4">Componentes do Sistema</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li className="text-sm">
              <span className="font-semibold">AI Agent</span>
              <br />
              <span className="text-gray-600">Processa as solicitações e coordena as ações</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">Agendar</span>
              <br />
              <span className="text-gray-600">Cria novos eventos no Google Calendar</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">Consultar</span>
              <br />
              <span className="text-gray-600">Lista eventos existentes</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">Deletar</span>
              <br />
              <span className="text-gray-600">Remove eventos do calendário</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">OpenAI Chat Model</span>
              <br />
              <span className="text-gray-600">Modelo de linguagem para processamento</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">Simple Memory</span>
              <br />
              <span className="text-gray-600">Mantém o contexto da conversa</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold">When chat message received</span>
              <br />
              <span className="text-gray-600">Inicia o fluxo de processamento</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 