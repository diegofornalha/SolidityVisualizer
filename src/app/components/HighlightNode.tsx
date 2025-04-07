'use client';

import React from 'react';
import styles from './flowStyles.module.css';

// Placeholder - Será substituído pelo componente real quando ReactFlow for instalado
interface HighlightNodeProps {
  data: {
    label: string;
  };
}

const HighlightNode = ({ data }: HighlightNodeProps) => {
  return (
    <div className={`${styles.item} ${styles.highlight}`}>
      {/* Handles serão adicionados quando o ReactFlow for instalado */}
      <div>{data.label}</div>
    </div>
  );
};

export default HighlightNode; 