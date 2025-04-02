import { useState, useEffect, useCallback } from "react";
import {
  cacheDiagramAndExplanation,
  getCachedDiagram,
} from "~/app/_actions/cache";
import { getLastGeneratedDate } from "~/app/_actions/repo";
import { getCostOfGeneration, generateDiagramFromPrompt } from "~/lib/fetch-backend";
import { exampleRepos } from "~/lib/exampleRepos";

interface StreamState {
  status:
    | "idle"
    | "started"
    | "explanation_sent"
    | "explanation"
    | "explanation_chunk"
    | "mapping_sent"
    | "mapping"
    | "mapping_chunk"
    | "diagram_sent"
    | "diagram"
    | "diagram_chunk"
    | "complete"
    | "error";
  message?: string;
  explanation?: string;
  mapping?: string;
  diagram?: string;
  error?: string;
}

interface StreamResponse {
  status: StreamState["status"];
  message?: string;
  chunk?: string;
  explanation?: string;
  mapping?: string;
  diagram?: string;
  error?: string;
}

export function useDiagram(username: string, repo: string) {
  const [diagram, setDiagram] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [lastGenerated, setLastGenerated] = useState<Date | undefined>();
  const [cost, setCost] = useState<string>("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  // const [tokenCount, setTokenCount] = useState<number>(0);
  const [state, setState] = useState<StreamState>({ status: "idle" });
  const [hasUsedFreeGeneration, setHasUsedFreeGeneration] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("has_used_free_generation") === "true";
    },
  );

  const generateDiagram = useCallback(async (prompt: string) => {
    setLoading(true);
    setError("");

    try {
      const openai_key = localStorage.getItem("openai_key");
      if (!openai_key) {
        throw new Error("Chave da API OpenAI não encontrada");
      }

      const response = await generateDiagramFromPrompt(prompt, openai_key);
      setDiagram(response.diagram);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('State changed:', { status: state.status, hasDiagram: !!state.diagram });
    if (state.status === "complete" && state.diagram) {
      console.log('Attempting to cache diagram...', {
        username,
        repo,
        diagramLength: state.diagram.length,
        explanationLength: state.explanation?.length
      });
      // Cache the completed diagram with the usedOwnKey flag
      const hasApiKey = !!localStorage.getItem("openai_key");
      void cacheDiagramAndExplanation(
        username,
        repo,
        state.diagram,
        state.explanation ?? "No explanation provided",
        hasApiKey,
      ).catch(error => {
        console.error('Error in caching effect:', error);
      });
      setDiagram(state.diagram);
      void getLastGeneratedDate(username, repo).then((date) =>
        setLastGenerated(date ?? undefined),
      );
    } else if (state.status === "error") {
      setLoading(false);
    }
  }, [state.status, state.diagram, username, repo, state.explanation]);

  const getDiagram = useCallback(async () => {
    setLoading(true);
    setError("");
    setCost("");

    try {
      // Check cache first - always allow access to cached diagrams
      const cached = await getCachedDiagram(username, repo);

      if (cached) {
        setDiagram(cached);
        const date = await getLastGeneratedDate(username, repo);
        setLastGenerated(date ?? undefined);
        return;
      }

      // Check for API key before proceeding
      const storedApiKey = localStorage.getItem("openai_key");
      if (!storedApiKey) {
        setError(
          "An OpenAI API key is required to generate diagrams. Please provide your API key to continue.",
        );
        setState({ status: "error", error: "API key required" });
        setLoading(false);
        return;
      }

      // Get cost estimate
      const costEstimate = await getCostOfGeneration(
        username,
        repo,
        "",
      );

      if (costEstimate.error) {
        console.error("Cost estimation failed:", costEstimate.error);
        // if (costEstimate.requires_api_key) {
        //   setTokenCount(costEstimate.token_count ?? 0);
        // }
        // TODO: come to think of it, why is requires api key based on tokens? this unimplemented option is smarter. Add API key dialog
        setError(costEstimate.error);
        return;
      }

      setCost(costEstimate.cost ?? "");

      // Start streaming generation
      await generateDiagram("");

      // Note: The diagram and lastGenerated will be set by the generateDiagram function
      // through the state updates
    } catch (error) {
      console.error("Error in getDiagram:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [username, repo, generateDiagram]);

  useEffect(() => {
    void getDiagram();
  }, [getDiagram]);

  const isExampleRepo = (repoName: string): boolean => {
    return Object.values(exampleRepos).some((value) =>
      value.includes(repoName),
    );
  };

  const handleModify = async (instructions: string) => {
    if (isExampleRepo(repo)) {
      setError("Example repositories cannot be modified.");
      return;
    }

    setLoading(true);
    setError("");
    setCost("");
    try {
      const storedApiKey = localStorage.getItem("openai_key");

      // Check for API key before proceeding
      if (!storedApiKey) {
        setError(
          "An OpenAI API key is required to generate diagrams. Please provide your API key to continue.",
        );
        setState({ status: "error", error: "API key required" });
        setLoading(false);
        return;
      }

      // Start streaming generation with instructions
      await generateDiagram(instructions);
    } catch (error) {
      console.error("Error modifying diagram:", error);
      setError("Failed to modify diagram. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (instructions: string) => {
    if (isExampleRepo(repo)) {
      setError("Example repositories cannot be regenerated.");
      return;
    }

    setLoading(true);
    setError("");
    setCost("");
    try {
      const costEstimate = await getCostOfGeneration(username, repo, "");

      if (costEstimate.error) {
        console.error("Cost estimation failed:", costEstimate.error);
        setError(costEstimate.error);
        return;
      }

      setCost(costEstimate.cost ?? "");

      // Start streaming generation with instructions
      await generateDiagram(instructions);
    } catch (error) {
      console.error("Error regenerating diagram:", error);
      setError("Failed to regenerate diagram. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diagram);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleExportImage = () => {
    const svgElement = document.querySelector(".mermaid svg");
    if (!(svgElement instanceof SVGSVGElement)) return;

    try {
      const canvas = document.createElement("canvas");
      const scale = 4;

      const bbox = svgElement.getBBox();
      const transform = svgElement.getScreenCTM();
      if (!transform) return;

      const width = Math.ceil(bbox.width * transform.a);
      const height = Math.ceil(bbox.height * transform.d);
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();

      img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);

        const a = document.createElement("a");
        a.download = "diagram.png";
        a.href = canvas.toDataURL("image/png", 1.0);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };

  const handleApiKeySubmit = async (apiKey: string) => {
    setShowApiKeyDialog(false);
    setLoading(true);
    setError("");

    // Store the key first
    localStorage.setItem("openai_key", apiKey);

    // Then generate diagram using stored key
    try {
      await generateDiagram("");
    } catch (error) {
      console.error("Error generating with API key:", error);
      setError("Failed to generate diagram with provided API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseApiKeyDialog = () => {
    setShowApiKeyDialog(false);
  };

  const handleOpenApiKeyDialog = () => {
    setShowApiKeyDialog(true);
  };

  return {
    diagram,
    error,
    loading,
    lastGenerated,
    cost,
    handleModify,
    handleRegenerate,
    handleCopy,
    showApiKeyDialog,
    // tokenCount,
    handleApiKeySubmit,
    handleCloseApiKeyDialog,
    handleOpenApiKeyDialog,
    handleExportImage,
    state,
  };
}
