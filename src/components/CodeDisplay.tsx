"use client";

import React from "react";
import { CopyButton } from "@/components/copy-button";

interface CodeDisplayProps {
  code: string;
  language?: string;
}

export default function CodeDisplay({ code, language = "solidity" }: CodeDisplayProps) {
  // Função para adicionar quebras de linha
  const formatCode = (code: string) => {
    return code.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <pre className={`language-${language} p-4 bg-slate-100 dark:bg-slate-900 rounded-md overflow-auto`}>
        <code className="text-sm">{formatCode(code)}</code>
      </pre>
    </div>
  );
}
