"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { getStarCount } from "~/app/_actions/github";
import { ApiKeyDialog } from "./api-key-dialog";

export function Header() {
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    void getStarCount().then(setStarCount);
  }, []);

  const formatStarCount = (count: number | null) => {
    if (!count) return "0";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem("openai_key", apiKey);
    setIsApiKeyDialogOpen(false);
  };

  return (
    <header className="border-b-[3px] border-primary">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-semibold sm:text-xl">
            <span className="text-foreground transition-colors duration-200 hover:text-primary">
              Flow
            </span>
            <span className="text-primary transition-colors duration-200 hover:text-accent">
              Agents
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <span
            onClick={() => setIsApiKeyDialogOpen(true)}
            className="cursor-pointer text-sm font-medium text-foreground transition-transform hover:translate-y-[-2px] hover:text-primary"
          >
            <span className="flex items-center sm:hidden">
              <span>Chave API</span>
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <span>Chave API</span>
            </span>
          </span>
          <Link
            href="https://github.com/diegofornalha/flowagents"
            className="flex items-center gap-1 text-sm font-medium text-foreground transition-transform hover:translate-y-[-2px] hover:text-primary sm:gap-2"
          >
            <FaGithub className="h-5 w-5" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </nav>

        <ApiKeyDialog
          isOpen={isApiKeyDialogOpen}
          onClose={() => setIsApiKeyDialogOpen(false)}
          onSubmit={handleApiKeySubmit}
        />
      </div>
    </header>
  );
}
