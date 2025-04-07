'use client';

import React from 'react';
import Link from 'next/link';

const MCPXDiagramV0RefactorPage = () => {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      color: '#00BFFF', 
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Link href="/" style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        color: '#00BFFF',
        textDecoration: 'none'
      }}>← Voltar</Link>
      
      <h1>Diagrama MCPX (Versão Refatorada)</h1>
      
      <div style={{ 
        maxWidth: '600px', 
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>Esta é uma versão refatorada do diagrama MCPX que utiliza a biblioteca React Flow.</p>
        <p>Para implementar este diagrama, instale a biblioteca React Flow:</p>
        <pre style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '10px',
          borderRadius: '4px',
          color: 'white',
          textAlign: 'left'
        }}>npm install reactflow</pre>
        
        <p>Após a instalação, este placeholder será substituído pelo diagrama interativo.</p>
        
        <p style={{ marginTop: '20px', color: '#ffc107' }}>
          <strong>Benefícios da refatoração:</strong>
        </p>
        <ul style={{ textAlign: 'left' }}>
          <li>Elimina o carregamento de scripts externos (jQuery, jsPlumb, etc.)</li>
          <li>Melhora a performance e segurança</li>
          <li>Componentes React nativos para os nós do diagrama</li>
          <li>Pan e zoom prontos para uso</li>
          <li>Arrastar nós sem dependências adicionais</li>
          <li>Layout automático integrado</li>
        </ul>
        
        <div style={{ marginTop: '30px' }}>
          <Link href="/diagrama/mcpx/v0" style={{
            color: '#00BFFF',
            textDecoration: 'none',
            border: '1px solid #00BFFF',
            padding: '8px 16px',
            borderRadius: '4px',
            marginRight: '10px'
          }}>
            Ver Versão Atual
          </Link>
          
          <Link href="https://github.com/wbkd/react-flow" target="_blank" style={{
            color: '#00BFFF',
            textDecoration: 'none',
            border: '1px solid #00BFFF',
            padding: '8px 16px',
            borderRadius: '4px'
          }}>
            Documentação React Flow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MCPXDiagramV0RefactorPage; 