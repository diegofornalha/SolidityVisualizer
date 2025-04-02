import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt não fornecido" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não fornecida" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em criar diagramas Mermaid customizados e detalhados. Sua tarefa é gerar diagramas ESPECÍFICOS para o prompt do usuário, evitando soluções genéricas e explorando o domínio em profundidade.

REGRAS IMPORTANTES:
1. ADAPTE o tipo de diagrama ao contexto do prompt. Use:
   - flowchart TD/LR: para fluxos de trabalho, processos e algoritmos
   - sequenceDiagram: para interação entre sistemas ou componentes
   - classDiagram: para relações entre componentes/classes/entidades
   - stateDiagram: para máquinas de estado e transições
   - erDiagram: para relações de banco de dados
   - gantt: para cronogramas e projetos
   - mindmap: para mapas mentais e conceituais
   - pie: para distribuições e estatísticas
   
2. ELEMENTOS ESPECÍFICOS:
   - Use nomes descritivos e específicos ao domínio do prompt
   - Crie entre 6-15 elementos para cobrir adequadamente o tema
   - Evite diagramas genéricos tipo "Início → Processo → Decisão → Fim"
   - Adicione ao menos 2-3 níveis de profundidade nas relações

3. ESTILOS E DETALHES:
   - Use cores baseadas na semântica dos elementos:
     * style Inicio fill:#bbf,stroke:#33b
     * style Processo fill:#bfb,stroke:#3b3
     * style Decisao fill:#fbb,stroke:#b33
     * style FimSucesso fill:#9f9,stroke:#3b3
     * style FimFalha fill:#f99,stroke:#b33
     * style Dados fill:#bbf,stroke:#33b
   
4. CONTEXTOS ESPECIAIS:
   - Para fluxos de IA: mostre pré-processamento, treinamento, validação, inferência
   - Para APIs: inclua endpoints, requisições, respostas e códigos de status
   - Para sistemas: mostre componentes, dados, integrações e fluxos
   - Para processos: detalhe cada etapa com condições e possíveis resultados

5. RECURSOS AVANÇADOS:
   - Use subgráficos para agrupar elementos relacionados (subgraph)
   - Adicione links entre seções distantes quando apropriado
   - Use comentários onde necessário para clarificar partes complexas
   - Crie estilo visual consistente com padrão de cores baseado no tema

6. SINTAXE CORRETA - MUITO IMPORTANTE:
   - Cada nó e conexão deve estar em uma linha separada
   - Coloque cada definição de estilo em sua própria linha
   - Sempre inicie com a declaração do tipo de diagrama em uma linha separada
   - Adicione espaçamento adequado entre as seções do diagrama
   - Exemplo de sintaxe correta:
     
     flowchart TD
       A[Início] --> B[Processo]
       B --> C{Decisão}
       C -->|Sim| D[Resultado]
       C -->|Não| E[Alternativa]
       
       style A fill:#bbf,stroke:#33b
       style C fill:#fbb,stroke:#b33
     

Sua resposta deve conter APENAS o código Mermaid funcional, sem texto explicativo. Use a sintaxe correta do Mermaid para garantir que o diagrama seja renderizado corretamente.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const diagramCode = completion.choices[0]?.message?.content?.trim();

      if (!diagramCode) {
        throw new Error("Falha ao gerar o diagrama");
      }

      // Verificar se o diagrama parece ser um código Mermaid válido
      const containsMermaidSyntax = /flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|mindmap|pie|graph/i.test(diagramCode);
      
      if (!containsMermaidSyntax) {
        // Se não contiver sintaxe válida, tente extrair o código de bloco de código
        const codeBlockMatch = diagramCode.match(/```(?:mermaid)?\s*([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          // Extrair o conteúdo do bloco de código
          return NextResponse.json({ diagram: codeBlockMatch[1].trim() });
        }
        
        // Criar um diagrama personalizado baseado no prompt
        const words = prompt.toLowerCase().split(/\s+/);
        const domain = identifyDomain(words);
        
        return NextResponse.json({
          diagram: generateCustomFallbackDiagram(domain, prompt)
        });
      }

      return NextResponse.json({ diagram: diagramCode });
    } catch (openaiError) {
      console.error("Erro na chamada à OpenAI:", openaiError);
      
      // Processar o prompt para determinar um domínio
      const words = prompt.toLowerCase().split(/\s+/);
      const domain = identifyDomain(words);
      
      // Gerar um diagrama personalizado baseado no domínio
      return NextResponse.json({
        diagram: generateCustomFallbackDiagram(domain, prompt)
      });
    }
  } catch (error) {
    console.error("Erro ao gerar diagrama:", error);
    return NextResponse.json(
      { error: "Erro ao gerar o diagrama" },
      { status: 500 }
    );
  }
}

// Função para identificar o domínio baseado nas palavras-chave do prompt
function identifyDomain(words: string[]): string {
  const domains = {
    saude: ['saúde', 'médico', 'paciente', 'hospital', 'clínica', 'consulta', 'tratamento', 'doença', 'diagnóstico', 'agendamento'],
    tecnologia: ['software', 'sistema', 'aplicativo', 'app', 'dados', 'api', 'servidor', 'rede', 'desenvolvimento', 'programação', 'código', 'interface', 'usuário', 'algoritmo'],
    educacao: ['educação', 'escola', 'ensino', 'professor', 'aluno', 'curso', 'aula', 'aprendizado', 'conhecimento', 'estudo'],
    negocios: ['empresa', 'negócio', 'venda', 'cliente', 'produto', 'serviço', 'marketing', 'financeiro', 'gestão', 'contabilidade', 'recurso', 'processo'],
    ia: ['ia', 'inteligência', 'artificial', 'machine', 'learning', 'ml', 'aprendizado', 'modelo', 'predição', 'classificação', 'treinamento', 'neural', 'rede'],
  };
  
  // Contar ocorrências de palavras em cada domínio
  const counts: {[key: string]: number} = {};
  
  for (const [domain, keywords] of Object.entries(domains)) {
    counts[domain] = words.filter(word => 
      keywords.some(keyword => word.includes(keyword))
    ).length;
  }
  
  // Encontrar o domínio com mais ocorrências
  let maxCount = 0;
  let dominantDomain = 'geral';
  
  for (const [domain, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantDomain = domain;
    }
  }
  
  return maxCount > 0 ? dominantDomain : 'geral';
}

// Função para gerar diagramas personalizados baseado no domínio
function generateCustomFallbackDiagram(domain: string, prompt: string): string {
  switch (domain) {
    case 'saude':
      return `sequenceDiagram
    participant Paciente
    participant Recepção
    participant Médico
    participant SistemaAgendamento
    participant ProntuárioEletrônico
    
    Paciente->>Recepção: Solicita consulta
    Recepção->>SistemaAgendamento: Verifica disponibilidade
    SistemaAgendamento-->>Recepção: Exibe horários disponíveis
    Recepção->>Paciente: Apresenta opções
    Paciente->>Recepção: Escolhe horário
    Recepção->>SistemaAgendamento: Confirma agendamento
    SistemaAgendamento->>ProntuárioEletrônico: Cria registro de consulta
    SistemaAgendamento-->>Médico: Notifica nova consulta
    
    Note over Paciente,Médico: Dia da consulta
    
    Paciente->>Recepção: Check-in
    Recepção->>ProntuárioEletrônico: Atualiza status
    ProntuárioEletrônico-->>Médico: Notifica chegada
    Médico->>ProntuárioEletrônico: Acessa histórico
    Médico->>Paciente: Realiza atendimento
    Médico->>ProntuárioEletrônico: Registra diagnóstico
    ProntuárioEletrônico-->>Paciente: Envia prescrição digital`;
      
    case 'tecnologia':
      return `flowchart TD
    subgraph Frontend
        A[Página Inicial] --> B[Formulário de Entrada]
        B --> C{Validação}
        C -->|Válido| D[Enviar Requisição API]
        C -->|Inválido| E[Exibir Erro]
        E --> B
    end
    
    subgraph Backend
        F[API Gateway] --> G[Autenticação]
        G -->|Falha| H[Erro 401]
        G -->|Sucesso| I[Processamento]
        I --> J[Acesso BD]
        J --> K[Lógica de Negócio]
        K --> L[Resposta API]
    end
    
    subgraph Banco de Dados
        M[(Dados Usuário)]
        N[(Logs)]
        O[(Configurações)]
    end
    
    D --> F
    L --> P[Atualização UI]
    P --> Q[Feedback Usuário]
    J --> M
    K --> N
    I --> O
    
    style A fill:#bbf,stroke:#33b
    style C fill:#fbb,stroke:#b33
    style G fill:#fbb,stroke:#b33
    style K fill:#bfb,stroke:#3b3
    style M fill:#bbf,stroke:#33b
    style N fill:#bbf,stroke:#33b
    style O fill:#bbf,stroke:#33b`;
      
    case 'educacao':
      return `flowchart TD
    A[Início Processo Educacional] --> B[Avaliação Diagnóstica]
    B --> C{Nível de Conhecimento}
    
    C -->|Básico| D[Curso Introdutório]
    C -->|Intermediário| E[Curso Regular]
    C -->|Avançado| F[Curso Especializado]
    
    D --> G[Módulo 1: Fundamentos]
    E --> H[Módulo 2: Conceitos]
    F --> I[Módulo 3: Aplicações]
    
    G --> J[Atividades Práticas]
    H --> J
    I --> J
    
    J --> K{Avaliação}
    K -->|Aprovado| L[Certificação]
    K -->|Reprovado| M[Reforço]
    M --> J
    
    L --> N[Próximo Nível]
    N --> O{Continuar?}
    O -->|Sim| C
    O -->|Não| P[Fim do Processo]
    
    style A fill:#bbf,stroke:#33b
    style C fill:#fbb,stroke:#b33
    style K fill:#fbb,stroke:#b33
    style O fill:#fbb,stroke:#b33
    style D fill:#bfb,stroke:#3b3
    style E fill:#bfb,stroke:#3b3
    style F fill:#bfb,stroke:#3b3
    style L fill:#9f9,stroke:#3b3
    style P fill:#bbf,stroke:#33b`;
      
    case 'negocios':
      return `flowchart TD
    A[Identificação de Oportunidade] --> B[Pesquisa de Mercado]
    B --> C[Análise de Concorrência]
    C --> D{Viabilidade}
    
    D -->|Viável| E[Plano de Negócio]
    D -->|Inviável| Z[Abandono do Projeto]
    
    E --> F[Captação de Recursos]
    F --> G{Financiamento}
    
    G -->|Aprovado| H[Desenvolvimento do Produto]
    G -->|Reprovado| I[Revisão do Plano]
    I --> E
    
    H --> J[Estratégia de Marketing]
    J --> K[Lançamento]
    K --> L[Monitoramento de Desempenho]
    L --> M{Resultados}
    
    M -->|Positivos| N[Expansão]
    M -->|Neutros| O[Otimização]
    M -->|Negativos| P[Pivotagem]
    
    N --> Q[Novos Mercados]
    O --> R[Ajustes no Produto]
    P --> S[Reformulação da Estratégia]
    
    Q --> L
    R --> L
    S --> L
    
    style A fill:#bbf,stroke:#33b
    style D fill:#fbb,stroke:#b33
    style G fill:#fbb,stroke:#b33
    style M fill:#fbb,stroke:#b33
    style Z fill:#f99,stroke:#b33
    style N fill:#9f9,stroke:#3b3
    style O fill:#bfb,stroke:#3b3
    style P fill:#fbb,stroke:#b33`;
      
    case 'ia':
      return `flowchart LR
    A[Coleta de Dados] --> B[Pré-processamento]
    B --> C[Análise Exploratória]
    
    C --> D{Tipo de Problema}
    D -->|Classificação| E[Modelos Supervisionados]
    D -->|Regressão| F[Modelos Preditivos]
    D -->|Agrupamento| G[Modelos Não-Supervisionados]
    
    E --> H[Random Forest]
    E --> I[SVM]
    E --> J[Redes Neurais]
    
    F --> K[Regressão Linear]
    F --> L[Regressão Logística]
    F --> M[Gradient Boosting]
    
    G --> N[K-Means]
    G --> O[DBSCAN]
    G --> P[Hierarchical Clustering]
    
    subgraph Treinamento
      Q[Divisão Treino/Teste]
      R[Validação Cruzada]
      S[Ajuste de Hiperparâmetros]
      T[Métricas de Avaliação]
    end
    
    H & I & J & K & L & M & N & O & P --> Treinamento
    Treinamento --> U[Modelo Final]
    
    U --> V[Deploy]
    V --> W[Monitoramento]
    W --> X{Desempenho}
    X -->|Satisfatório| Y[Produção]
    X -->|Insatisfatório| Z[Retreinamento]
    Z --> Treinamento
    
    style A fill:#bbf,stroke:#33b
    style D fill:#fbb,stroke:#b33
    style X fill:#fbb,stroke:#b33
    style U fill:#bfb,stroke:#3b3
    style Y fill:#9f9,stroke:#3b3
    style Z fill:#f99,stroke:#b33`;
      
    default:
      // Tentar extrair informações do prompt
      const topics = extractTopics(prompt);
      return generateGenericFlowchart(topics);
  }
}

// Extrair tópicos ou conceitos-chave do prompt
function extractTopics(prompt: string): string[] {
  // Dividir o prompt em palavras
  const words = prompt.split(/[\s,.!?;:()[\]{}'"]+/);
  
  // Filtrar palavras curtas e comuns
  const filteredWords = words.filter(word => 
    word.length > 3 &&
    !['para', 'como', 'mais', 'menos', 'esse', 'esta', 'isto', 'aqui', 'hoje', 'cada', 'todos'].includes(word.toLowerCase())
  );
  
  // Pegar até 5 palavras mais longas (provavelmente mais significativas)
  return filteredWords
    .sort((a, b) => b.length - a.length)
    .slice(0, 5)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); // Capitalizar
}

// Gerar um fluxograma genérico baseado em tópicos extraídos
function generateGenericFlowchart(topics: string[]): string {
  // Se não temos tópicos suficientes, usar genéricos
  if (topics.length < 3) {
    topics = [...topics, 'Análise', 'Planejamento', 'Execução', 'Verificação', 'Ação'].slice(0, 5);
  }
  
  // Construir um diagrama baseado nos tópicos
  return `flowchart TD
    A[Início] --> B[${topics[0]}]
    B --> C[${topics[1]}]
    
    C --> D{Avaliação}
    D -->|Opção 1| E[${topics[2]}]
    D -->|Opção 2| F[${topics.length > 3 ? topics[3] : 'Alternativa'}]
    
    E --> G[${topics.length > 4 ? topics[4] : 'Conclusão'}]
    F --> G
    G --> H[Fim]
    
    style A fill:#bbf,stroke:#33b
    style D fill:#fbb,stroke:#b33
    style G fill:#bfb,stroke:#3b3
    style H fill:#bbf,stroke:#33b`;
} 