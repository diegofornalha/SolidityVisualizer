import { NextRequest, NextResponse } from 'next/server';

// Função que simula o uso da LLM ARCEE para gerar um diagrama Mermaid
async function generateMermaidDiagram(prompt: string): Promise<string> {
  // Aqui seria a integração real com a LLM ARCEE
  // Por enquanto estamos apenas simulando a resposta

  console.log('Processando prompt com ARCEE:', prompt);
  
  // Identificar palavras-chave no prompt para gerar um diagrama relevante
  const keywords = prompt.toLowerCase();
  
  // Diagrama padrão para NFT Marketplace
  if (keywords.includes('nft') || keywords.includes('marketplace') || keywords.includes('token')) {
    return `
sequenceDiagram
    participant User as Usuário
    participant Market as NFT Marketplace
    participant NFT as Agente NFT
    participant Payment as Sistema de Pagamento
    
    User->>Market: Listar NFT para venda
    Market->>NFT: Verificar propriedade
    NFT-->>Market: Confirmação de propriedade
    Market->>Market: Registrar NFT no mercado
    Market-->>User: Confirmação de listagem
    
    User->>Market: Comprar NFT
    Market->>Payment: Processar pagamento
    Payment-->>Market: Confirmação de pagamento
    Market->>NFT: Transferir propriedade
    NFT-->>Market: Propriedade transferida
    Market-->>User: Confirmação de compra
    `;
  }
  
  // Diagrama para votação blockchain
  if (keywords.includes('vota') || keywords.includes('eleição') || keywords.includes('governança')) {
    return `
sequenceDiagram
    participant Voter as Eleitor
    participant Contract as Agente de Votação
    participant Chain as Blockchain
    
    Voter->>Contract: Registrar para votar
    Contract->>Chain: Verificar identidade
    Chain-->>Contract: Identidade verificada
    Contract-->>Voter: Registro confirmado
    
    Voter->>Contract: Enviar voto
    Contract->>Contract: Verificar elegibilidade
    Contract->>Chain: Registrar voto
    Chain-->>Contract: Voto registrado
    Contract-->>Voter: Confirmação de voto
    
    Voter->>Contract: Solicitar resultados
    Contract->>Chain: Calcular resultados
    Chain-->>Contract: Resultados calculados
    Contract-->>Voter: Exibir resultados
    `;
  }
  
  // Diagrama genérico se nenhum padrão for encontrado
  return `
sequenceDiagram
    participant User as Usuário
    participant Contract as Agente Inteligente
    participant Blockchain
    
    User->>Contract: Iniciar transação
    Contract->>Contract: Validar dados
    Contract->>Blockchain: Executar lógica
    Blockchain-->>Contract: Confirmar execução
    Contract-->>User: Retornar resultado
    
    User->>Contract: Consultar estado
    Contract->>Blockchain: Ler dados
    Blockchain-->>Contract: Retornar dados
    Contract-->>User: Exibir estado atual
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt inválido ou ausente' },
        { status: 400 }
      );
    }
    
    // Log para debug
    console.log('Recebido prompt:', prompt);
    
    // Gerar diagrama usando a função que simula o ARCEE
    const diagram = await generateMermaidDiagram(prompt);
    
    // Log do diagrama gerado
    console.log('Diagrama gerado com sucesso');
    
    return NextResponse.json({ 
      success: true, 
      diagram,
      message: 'Diagrama gerado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { 
        error: 'Falha ao processar a solicitação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 