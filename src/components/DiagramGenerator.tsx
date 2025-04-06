"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiagramGeneratorProps {
  onGenerate: (description: string, style: string) => void;
  initialDescription?: string;
  isLoading: boolean;
}

export default function DiagramGenerator({
  onGenerate,
  initialDescription = "",
  isLoading,
}: DiagramGeneratorProps) {
  const [description, setDescription] = useState<string>(initialDescription);
  const [style, setStyle] = useState<string>("simple");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onGenerate(description, style);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleStyleChange = (value: string) => {
    setStyle(value);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Descreva seu Contrato Inteligente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Descrição
          </label>
          <Textarea
            id="description"
            placeholder="Descreva o contrato inteligente que você deseja visualizar..."
            value={description}
            onChange={handleDescriptionChange}
            rows={10}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="style" className="block text-sm font-medium">
            Estilo do Diagrama
          </label>
          <Select value={style} onValueChange={handleStyleChange}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Selecione o estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simples</SelectItem>
              <SelectItem value="detailed">Detalhado</SelectItem>
              <SelectItem value="flowchart">Fluxograma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !description.trim()}
        >
          {isLoading ? "Gerando..." : "Gerar Diagrama"}
        </Button>
      </form>
    </div>
  );
}
