'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ActorNode from '../../../components/ActorNode';
import SystemNode from '../../../components/SystemNode';
import HighlightNode from '../../../components/HighlightNode';
import styles from '../../../components/flowStyles.module.css';

// Este código é uma referência para quando ReactFlow estiver instalado
// Para implementá-lo, primeiro execute: npm install reactflow

/**
 * Importação dinâmica do ReactFlow para evitar problemas de SSR
 * Esta abordagem é necessária porque o ReactFlow usa APIs do navegador
 * que não estão disponíveis durante a renderização do servidor
 */
const ReactFlowWithNoSSR = dynamic(
  async () => {
    // Quando ReactFlow estiver instalado, descomente estas linhas:
    // const { ReactFlow, Controls, Background } = await import('reactflow');
    // import 'reactflow/dist/style.css';
    // return { ReactFlow, Controls, Background };
    
    // Versão temporária para compilação:
    return {
      ReactFlow: (props: any) => <div className={styles.reactFlow}>{props.children}</div>,
      Controls: () => <div>Controls</div>,
      Background: () => <div>Background</div>
    };
  },
  { ssr: false }
);

// Tipos para os nós e arestas
type Node = {
  id: string;
  type: string;
  data: { label: string };
  position: { x: number, y: number };
}

type Edge = {
  id: string;
  source: string;
  target: string;
  type?: string;
}

const MCPXDiagramV0PageComplete = () => {
  // Estado para armazenar nós e arestas
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowLoaded, setReactFlowLoaded] = useState(false);

  useEffect(() => {
    // Definir nós iniciais
    const initialNodes: Node[] = [
      { id: 'usuario', type: 'actor', data: { label: 'Usuário' }, position: { x: 0, y: 0 } },
      { id: 'agenteIA', type: 'actor', data: { label: 'Agente IA' }, position: { x: 0, y: 0 } },
      { id: 'mcp', type: 'system', data: { label: 'Model Context Protocol' }, position: { x: 0, y: 0 } },
      { id: 'ferramExternas', type: 'system', data: { label: 'Ferramentas Externas' }, position: { x: 0, y: 0 } },
      { id: 'mcpxCrew', type: 'highlight', data: { label: '@MCPX CrewAI Prompt' }, position: { x: 0, y: 0 } },
      { id: 'respostaProc', type: 'highlight', data: { label: 'Resposta Processada' }, position: { x: 0, y: 0 } },
    ];

    // Definir conexões (arestas)
    const initialEdges: Edge[] = [
      { id: 'usuario-mcpxCrew', source: 'usuario', target: 'mcpxCrew' },
      { id: 'mcpxCrew-agenteIA', source: 'mcpxCrew', target: 'agenteIA' },
      { id: 'agenteIA-mcp', source: 'agenteIA', target: 'mcp' },
      { id: 'agenteIA-ferramExternas', source: 'agenteIA', target: 'ferramExternas' },
      { id: 'ferramExternas-agenteIA', source: 'ferramExternas', target: 'agenteIA' },
      { id: 'agenteIA-respostaProc', source: 'agenteIA', target: 'respostaProc' },
      { id: 'respostaProc-usuario', source: 'respostaProc', target: 'usuario' },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
    setReactFlowLoaded(true);
  }, []);

  // Mapeamento dos tipos de nós para componentes
  const nodeTypes = {
    actor: ActorNode,
    system: SystemNode,
    highlight: HighlightNode,
  };

  // Opções padrão para as arestas
  const defaultEdgeOptions = {
    style: { stroke: '#00BFFF', strokeWidth: '1.5' },
    animated: true,
  };

  if (!reactFlowLoaded) {
    return <div className={styles.container}>Carregando diagrama...</div>;
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>← Voltar</Link>
      
      {/* 
        Quando ReactFlow estiver instalado, este componente renderizará o diagrama
        com todos os nós e conexões definidos acima
      */}
      <ReactFlowWithNoSSR.ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className={styles.reactFlow}
      >
        <ReactFlowWithNoSSR.Controls />
        <ReactFlowWithNoSSR.Background color="#00BFFF" gap={16} />
      </ReactFlowWithNoSSR.ReactFlow>
    </div>
  );
};

export default MCPXDiagramV0PageComplete;

/**
 * Implementação dos componentes de nó (quando ReactFlow estiver instalado):
 * 
 * ActorNode.tsx:
 * ```
 * 'use client';
 * 
 * import React from 'react';
 * import { Handle, Position } from 'reactflow';
 * import styles from './flowStyles.module.css';
 * 
 * interface ActorNodeProps {
 *   data: {
 *     label: string;
 *   };
 * }
 * 
 * const ActorNode = ({ data }: ActorNodeProps) => {
 *   return (
 *     <div className={`${styles.item} ${styles.actor}`}>
 *       <Handle type="target" position={Position.Left} />
 *       <div>{data.label}</div>
 *       <Handle type="source" position={Position.Right} />
 *     </div>
 *   );
 * };
 * 
 * export default ActorNode;
 * ```
 * 
 * SystemNode.tsx e HighlightNode.tsx seguem o mesmo padrão,
 * apenas mudando a classe CSS para .system ou .highlight.
 */ 