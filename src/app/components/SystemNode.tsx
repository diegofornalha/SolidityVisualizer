'use client';

import React from 'react';
import styles from './flowStyles.module.css';

// Placeholder - Será substituído pelo componente real quando ReactFlow for instalado
interface SystemNodeProps {
  data: {
    label: string;
  };
}

const SystemNode = ({ data }: SystemNodeProps) => {
  return (
    <div className={`${styles.item} ${styles.system}`}>
      {/* Handles serão adicionados quando o ReactFlow for instalado */}
      <div>{data.label}</div>
    </div>
  );
};

export default SystemNode; 