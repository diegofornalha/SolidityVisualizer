/**
 * Formata o código do diagrama Mermaid para garantir que seja renderizado corretamente
 */
export function formatDiagramCode(diagramText: string): string {
  let formattedText = diagramText;
  
  // Remover delimitadores ```mermaid ou '''mermaid no início
  formattedText = formattedText.replace(/^(?:```|''')(?:mermaid)?\s*/i, '');
  // Remover delimitadores ``` ou ''' no final
  formattedText = formattedText.replace(/(?:```|''')$/i, '');
  
  // Determina o tipo de diagrama
  let diagramType = '';
  if (formattedText.match(/^(flowchart|graph)\s+(TD|LR|BT|RL)/i)) {
    diagramType = 'flowchart';
  } else if (formattedText.match(/^sequenceDiagram/i)) {
    diagramType = 'sequence';
  } else if (formattedText.match(/^classDiagram/i)) {
    diagramType = 'class';
  } else if (formattedText.match(/^erDiagram/i)) {
    diagramType = 'er';
  } else if (formattedText.match(/^gantt/i)) {
    diagramType = 'gantt';
  } else if (formattedText.match(/^pie/i)) {
    diagramType = 'pie';
  } else if (formattedText.match(/^stateDiagram/i)) {
    diagramType = 'state';
  } else {
    // Se não conseguir identificar, assume que é um flowchart
    diagramType = 'flowchart';
    // Adiciona a declaração de flowchart se não existir
    if (!formattedText.match(/^(flowchart|graph)\s+/i)) {
      formattedText = `flowchart TD ${formattedText}`;
    }
  }
  
  // Se já tiver quebras de linha, mantém como está
  if (formattedText.includes('\n')) {
    return formattedText;
  }
  
  // Formata baseado no tipo de diagrama
  switch (diagramType) {
    case 'flowchart':
      // Garante que a declaração inicial esteja em uma linha separada
      formattedText = formattedText.replace(/^(flowchart|graph)\s+(TD|LR|BT|RL)/i, '$1 $2\n  ');
      // Quebra relações
      formattedText = formattedText
        .replace(/([^\s])\s*(-->|---|---\|>|--o|--x|\.\.\.|===|~~~)/g, '$1\n  $2')
        .replace(/(-->|---|---\|>|--o|--x|\.\.\.|===|~~~)\s*([^\s])/g, '$1 $2')
        .replace(/(\[.*?\])\s*([^\s\[])/g, '$1\n  $2')
        .replace(/([^\]|\s])\s*(\[)/g, '$1\n  $2')
        .replace(/subgraph\s+([^\n]+)/g, 'subgraph $1\n  ')
        .replace(/end(\s+subgraph)?/g, '\nend')
        .replace(/style\s+([^\s]+)/g, '\n  style $1');
      break;
      
    case 'sequence':
      // Garante que a declaração inicial esteja em uma linha separada
      formattedText = formattedText.replace(/^sequenceDiagram/i, 'sequenceDiagram\n  ');
      // Quebra participantes, notas e mensagens
      formattedText = formattedText
        .replace(/participant\s+([^\s,]+)/gi, 'participant $1\n  ')
        .replace(/([^\s])\s*(->>|-->|--x|--\))/g, '$1\n  $2')
        .replace(/(->>|-->|--x|--\))\s*([^\s])/g, '$1 $2')
        .replace(/Note\s+(right|left|over)/gi, '\n  Note $1');
      break;
      
    case 'class':
    case 'er':
      // Quebra definições de classes/entidades e relações
      formattedText = formattedText
        .replace(/^(classDiagram|erDiagram)/i, '$1\n  ')
        .replace(/class\s+([^\s{]+)/gi, 'class $1\n  ')
        .replace(/([^\s])\s*(<--|-->|<\.\.|\.\.|--|<\|--|\|>--)/g, '$1\n  $2')
        .replace(/(<--|-->|<\.\.|\.\.|--|<\|--|\|>--)\s*([^\s])/g, '$1 $2');
      break;
      
    // Adicione formatações específicas para outros tipos conforme necessário
    default:
      // Formatação genérica para outros tipos
      formattedText = formattedText
        .replace(/([^\s,]+)\s*([^\s,]+)/g, (match, p1, p2) => {
          // Evita quebras dentro de strings entre aspas
          if (p1.endsWith('"') && p2.startsWith('"')) return match;
          // Evita quebras dentro de elementos entre colchetes
          if (p1.includes('[') && !p1.includes(']') && p2.includes(']')) return match;
          return `${p1}\n  ${p2}`;
        });
  }
  
  // Remove quebras de linha duplas e limpa espaçamentos excessivos
  formattedText = formattedText
    .replace(/\n\s*\n/g, '\n')
    .replace(/\n\s+/g, '\n  ')
    .trim();
  
  return formattedText;
} 