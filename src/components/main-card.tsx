"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Sparkles, Key } from "lucide-react";
import React from "react";
import { CustomizationDropdown } from "./customization-dropdown";
import { exampleRepos } from "~/lib/exampleRepos";
import { ExportDropdown } from "./export-dropdown";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { ApiKeyDialog } from "./api-key-dialog";

interface MainCardProps {
  isHome?: boolean;
  username?: string;
  repo?: string;
  showCustomization?: boolean;
  onModify?: (instructions: string) => void;
  onRegenerate?: (instructions: string) => void;
  onCopy?: () => void;
  lastGenerated?: Date;
  onExportImage?: () => void;
  zoomingEnabled?: boolean;
  onZoomToggle?: () => void;
  loading?: boolean;
}

export default function MainCard({
  isHome = true,
  username,
  repo,
  showCustomization,
  onModify,
  onRegenerate,
  onCopy,
  lastGenerated,
  onExportImage,
  zoomingEnabled,
  onZoomToggle,
  loading,
}: MainCardProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<
    "customize" | "export" | null
  >(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (username && repo) {
      setRepoUrl(`https://github.com/${username}/${repo}`);
    }
  }, [username, repo]);

  useEffect(() => {
    if (loading) {
      setActiveDropdown(null);
    }
  }, [loading]);

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_key");
    setHasApiKey(!!storedKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasApiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    const githubUrlPattern =
      /^https?:\/\/github\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_\.]+)\/?$/;
    const match = githubUrlPattern.exec(repoUrl.trim());

    if (!match) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    const [, username, repo] = match || [];
    if (!username || !repo) {
      setError("Invalid repository URL format");
      return;
    }
    const sanitizedUsername = encodeURIComponent(username);
    const sanitizedRepo = encodeURIComponent(repo);
    router.push(`/${sanitizedUsername}/${sanitizedRepo}`);
  };

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem("openai_key", apiKey);
    setHasApiKey(true);
    setShowApiKeyDialog(false);
  };

  const handleExampleClick = (repoPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(repoPath);
  };

  const handleDropdownToggle = (dropdown: "customize" | "export") => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <Card className="relative w-full max-w-3xl border-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4 shadow-lg sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Input
            placeholder="https://github.com/username/repo"
            className="flex-1 rounded-md border-2 border-primary/20 bg-card px-3 py-4 text-base font-bold shadow-sm transition-all placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:border-primary/50 focus:shadow-md sm:px-4 sm:py-6 sm:text-lg sm:placeholder:text-lg"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            className={`gradient-hover rounded-md border-0 p-4 px-4 text-base font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg sm:p-6 sm:px-6 sm:text-lg ${!hasApiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasApiKey}
          >
            {hasApiKey ? 'Visualize' : (
              <>
                <Key className="mr-2 h-5 w-5" />
                Set API Key
              </>
            )}
          </Button>
        </div>

        {!hasApiKey && (
          <div className="text-sm text-primary">
            <p className="mb-2">An OpenAI API key is required to generate diagrams for your own repositories. The diagrams will be generated using your API key and billed to your OpenAI account.</p>
            <Button
              type="button"
              onClick={() => setShowApiKeyDialog(true)}
              className="text-sm font-medium text-primary hover:text-primary/80"
              variant="link"
            >
              Click here to set your API key
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Dropdowns Container */}
        {!isHome && (
          <div className="space-y-4">
            {/* Only show buttons and dropdowns when not loading */}
            {!loading && (
              <>
                {/* Buttons Container */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
                  {showCustomization &&
                    onModify &&
                    onRegenerate &&
                    lastGenerated && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle("customize");
                        }}
                        className={`flex items-center justify-between gap-2 rounded-md border-2 border-primary/20 px-4 py-2 font-medium transition-all hover:border-primary/50 hover:shadow-sm sm:max-w-[250px] ${
                          activeDropdown === "customize"
                            ? "bg-primary/10"
                            : "bg-card hover:bg-primary/5"
                        }`}
                      >
                        <span>Customize Diagram</span>
                        {activeDropdown === "customize" ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    )}

                  {onCopy && lastGenerated && onExportImage && (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle("export");
                        }}
                        className={`flex items-center justify-between gap-2 rounded-md border-2 border-primary/20 px-4 py-2 font-medium transition-all hover:border-primary/50 hover:shadow-sm sm:max-w-[250px] ${
                          activeDropdown === "export"
                            ? "bg-primary/10"
                            : "bg-card hover:bg-primary/5"
                        }`}
                      >
                        <span>Export Diagram</span>
                        {activeDropdown === "export" ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  )}
                  {lastGenerated && (
                    <>
                      <label className="font-medium text-foreground">
                        Enable Zoom
                      </label>
                      <Switch
                        checked={zoomingEnabled}
                        onCheckedChange={onZoomToggle}
                      />
                    </>
                  )}
                </div>

                {/* Dropdown Content */}
                <div
                  className={`transition-all duration-200 ${
                    activeDropdown
                      ? "pointer-events-auto max-h-[500px] opacity-100"
                      : "pointer-events-none max-h-0 opacity-0"
                  }`}
                >
                  {activeDropdown === "customize" && (
                    <CustomizationDropdown
                      onModify={onModify!}
                      onRegenerate={onRegenerate!}
                      lastGenerated={lastGenerated!}
                      isOpen={true}
                      loading={loading}
                    />
                  )}
                  {activeDropdown === "export" && (
                    <ExportDropdown
                      onCopy={onCopy!}
                      lastGenerated={lastGenerated!}
                      onExportImage={onExportImage!}
                      isOpen={true}
                      loading={loading}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Example Repositories */}
        {isHome && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700 sm:text-base">
              Try these example repositories:
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exampleRepos).map(([name, path]) => (
                <Button
                  key={name}
                  variant="outline"
                  className="border-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:from-primary hover:to-secondary focus:ring-2 focus:ring-primary/50 sm:text-base"
                  onClick={(e) => handleExampleClick(path, e)}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </form>

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSubmit={handleApiKeySubmit}
      />

      {/* Decorative Sparkle */}
      <div className="absolute -bottom-8 -left-12 hidden sm:block">
        <Sparkles
          className="h-20 w-20 fill-yellow-400 text-black"
          strokeWidth={0.6}
          style={{ transform: "rotate(-15deg)" }}
        />
      </div>
    </Card>
  );
}
