import { NextRequest, NextResponse } from "next/server";

// Armazenamento em memória para desenvolvimento
let diagramas: any[] = [];

export async function GET() {
  try {
    // Retornar todos os diagramas
    return NextResponse.json(diagramas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar diagramas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar diagramas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, diagram } = body;
    
    if (!prompt || !diagram) {
      return NextResponse.json(
        { error: "Prompt e diagrama são obrigatórios" },
        { status: 400 }
      );
    }
    
    // Criar um novo diagrama
    const newDiagram = {
      id: diagramas.length + 1,
      prompt,
      diagram,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    diagramas.push(newDiagram);
    
    return NextResponse.json(newDiagram, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar diagrama:", error);
    return NextResponse.json(
      { error: "Erro ao criar diagrama" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID do diagrama é obrigatório" },
        { status: 400 }
      );
    }
    
    // Filtrar para remover o diagrama
    const diagramaIndex = diagramas.findIndex(d => d.id === parseInt(id));
    
    if (diagramaIndex === -1) {
      return NextResponse.json(
        { error: "Diagrama não encontrado" },
        { status: 404 }
      );
    }
    
    diagramas = diagramas.filter(d => d.id !== parseInt(id));
    
    return NextResponse.json(
      { message: "Diagrama excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir diagrama:", error);
    return NextResponse.json(
      { error: "Erro ao excluir diagrama" },
      { status: 500 }
    );
  }
}