import { NextResponse } from "next/server";
import { formatDiagramCode } from "~/lib/format-diagram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { diagram } = body;

    if (!diagram) {
      return NextResponse.json(
        { error: "O código do diagrama é obrigatório" },
        { status: 400 }
      );
    }

    // Formatar o código do diagrama
    const formattedDiagram = formatDiagramCode(diagram);

    return NextResponse.json({ diagram: formattedDiagram });
  } catch (error) {
    console.error("Erro ao processar o diagrama:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar o diagrama" },
      { status: 500 }
    );
  }
} 