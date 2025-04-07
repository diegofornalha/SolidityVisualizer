'use client';

import React from 'react';
import styles from './flowStyles.module.css';

// Placeholder - Será substituído pelo componente real quando ReactFlow for instalado
interface ActorNodeProps {
  data: {
    label: string;
  };
}

const ActorNode = ({ data }: ActorNodeProps) => {
  return (
    <div className={`${styles.item} ${styles.actor}`}>
      {/* Handles serão adicionados quando o ReactFlow for instalado */}
      <div>{data.label}</div>
    </div>
  );
};

export default ActorNode; 