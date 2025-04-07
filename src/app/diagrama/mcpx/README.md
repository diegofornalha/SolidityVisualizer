# Diagrama MCPX - Refatoração

## Visão Geral

Este diretório contém o diagrama MCPX, que ilustra o fluxo de interações entre usuário, agente IA, Model Context Protocol, ferramentas externas e processamento de respostas.

A versão atual (`v0/page.tsx`) usa jsPlumb e carrega scripts externos como jQuery, jQueryUI, Lodash e outros, o que pode ser ineficiente e introduzir riscos de segurança.

## Proposta de Refatoração

Uma nova implementação baseada em React Flow foi preparada para substituir a atual. Ela oferece:

- Eliminação de scripts externos carregados via CDNs
- Melhor performance e segurança
- Código mais limpo e manutenível
- Compatibilidade com as melhores práticas do Next.js
- Recursos nativos de arrastar nós, pan, zoom, etc.

## Arquivos de Referência

1. `v0/page-refactor.tsx` - Versão placeholder que exibe instruções para implementação
2. `v0/refatoracao-completa.tsx` - Código completo a ser usado quando React Flow estiver instalado
3. `v0/implementacao.md` - Instruções detalhadas para implementação

## Componentes Preparados

1. `/components/ActorNode.tsx` - Componente para nós do tipo ator
2. `/components/SystemNode.tsx` - Componente para nós do tipo sistema
3. `/components/HighlightNode.tsx` - Componente para nós com destaque
4. `/components/flowStyles.module.css` - Estilos CSS para os componentes

## Como Implementar

1. Instale a biblioteca React Flow:
   ```bash
   npm install reactflow
   ```

2. Atualize os componentes de nó para incluir as Handles do React Flow.

3. Renomeie `page-refactor.tsx` para `page.tsx` (ou substitua o conteúdo do arquivo existente).

## Comparação com a Versão Atual

| Aspecto | Versão Atual (jsPlumb) | Nova Versão (React Flow) |
|---------|-------------------------|--------------------------|
| Dependências | jQuery, jsPlumb, etc. | Apenas React Flow |
| Carregamento | Scripts via CDNs | NPM package |
| Manutenção | Código complexo | Componentes React modulares |
| Segurança | Riscos com scripts externos | Dependências controladas |
| Performance | Múltiplos carregamentos | Bundle otimizado |
| Interatividade | Implementação personalizada | Recursos nativos |

## Exibição da Versão Refatorada

Para visualizar como ficará a versão refatorada (antes de implementá-la completamente):

1. Acesse a rota `/diagrama/mcpx/v0-refactor` (após criar a página correspondente)
2. O placeholder exibirá as instruções e benefícios da nova implementação 