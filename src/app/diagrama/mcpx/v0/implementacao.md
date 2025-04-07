# Implementação do Diagrama MCPX com React Flow

Este documento contém instruções detalhadas para implementar o diagrama MCPX utilizando a biblioteca React Flow, substituindo a implementação atual baseada em jsPlumb.

## Motivação

A implementação atual do diagrama MCPX utiliza várias bibliotecas carregadas externamente:
- jQuery
- jQuery UI
- Lodash
- jsPlumb
- Dagre
- Panzoom

Isso causa diversos problemas:
1. Maior latência devido ao carregamento de scripts externos
2. Riscos de segurança
3. Código complexo e difícil de manter
4. Incompatibilidade com as melhores práticas do Next.js

## Solução Proposta

Substituir essas bibliotecas pela moderna biblioteca React Flow, que é:
- Específica para React
- Compatível com Next.js
- Inclui recursos nativos de arrastar, conectar nós, pan, zoom, etc.
- Gerenciada por npm/yarn, sem carregamento de scripts externos

## Passos para Implementação

1. **Instalar React Flow**
   ```bash
   npm install reactflow
   ```

2. **Estrutura de Arquivos**
   - `src/app/components/ActorNode.tsx`: Componente para nós do tipo ator
   - `src/app/components/SystemNode.tsx`: Componente para nós do tipo sistema
   - `src/app/components/HighlightNode.tsx`: Componente para nós destacados
   - `src/app/components/flowStyles.module.css`: Estilos para os componentes
   - `src/app/diagrama/mcpx/v0/page.tsx`: Componente principal do diagrama

3. **Implementação dos Nós**
   Cada tipo de nó (ator, sistema, destaque) foi implementado como um componente React separado, com os estilos visuais correspondentes do design original.

4. **Implementação do Layout**
   O layout automático é gerenciado pela funcionalidade integrada do React Flow, com direção da esquerda para a direita (LR), similar ao layout original.

5. **Interatividade**
   - Arrastar nós: funcionalidade nativa do React Flow
   - Pan e zoom: implementados com os controles padrão do React Flow
   - Conexões entre nós: definidas no código e gerenciadas automaticamente

## Benefícios da Nova Implementação

1. **Performance**: Redução de latência pela eliminação de carregamentos dinâmicos de scripts.
2. **Segurança**: Eliminação de riscos associados a scripts externos.
3. **Manutenibilidade**: Código mais limpo e modular, usando componentes React.
4. **Experiência do Usuário**: Controles modernos e responsivos para interagir com o diagrama.
5. **Compatibilidade**: Alinhamento com as melhores práticas do Next.js e React.

## Uso do Componente

```jsx
// Exemplo de como usar o componente em outra página
import MCPXDiagramV0Page from './diagrama/mcpx/v0/page';

const MinhaOutraPagina = () => {
  return (
    <div>
      <h1>Meu Diagrama MCPX</h1>
      <MCPXDiagramV0Page />
    </div>
  );
};
```

## Notas Adicionais

- Os estilos foram mantidos para preservar a aparência original do diagrama.
- O componente é responsivo e se adapta ao tamanho da janela.
- É possível personalizar as cores, fontes e outros aspectos visuais através do arquivo CSS. 