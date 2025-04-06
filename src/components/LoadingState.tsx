import React from "react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-base text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
}
