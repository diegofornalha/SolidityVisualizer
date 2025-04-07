'use client';

import React from 'react';
import { Pixelify_Sans } from 'next/font/google';
import styles from './FlowpixLogo.module.css';

// Carregamento otimizado da fonte usando next/font
const pixelifySans = Pixelify_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const FlowpixLogo = () => {
  return (
    <div className={styles.container}>
      <div 
        className={styles.glitchContainer} 
        role="img" 
        aria-label="Flowpix logo"
      >
        <span 
          className={`${styles.glitchText} ${pixelifySans.className}`}
          data-content="FLOWPIX"
        >
          FLOWPIX
        </span>
      </div>
    </div>
  );
};

export default FlowpixLogo; 