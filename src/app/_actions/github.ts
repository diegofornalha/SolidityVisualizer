import { cache } from "react";

interface GitHubResponse {
  stargazers_count: number;
}

export const getStarCount = cache(async () => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/diegofornalha/flowAgents",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      },
    );

    if (!response.ok) {
      console.warn("GitHub API returned non-200 status:", response.status);
      return 0; // Retorna 0 em vez de lançar um erro
    }

    const data = (await response.json()) as GitHubResponse;
    return data.stargazers_count;
  } catch (error) {
    console.warn("Error fetching star count:", error);
    return 0; // Retorna 0 em caso de erro
  }
});
