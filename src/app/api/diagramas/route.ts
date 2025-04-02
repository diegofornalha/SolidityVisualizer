import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { diagrams } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Buscar todos os diagramas do banco de dados
    const result = await db.select().from(diagrams).orderBy(diagrams.createdAt);
    
    return NextResponse.json(result, { status: 200 });
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
    
    // Inserir o novo diagrama no banco de dados
    const result = await db.insert(diagrams).values({
      prompt,
      diagram,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return NextResponse.json(result[0], { status: 201 });
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
    
    // Excluir o diagrama do banco de dados
    await db.delete(diagrams).where(eq(diagrams.id, parseInt(id)));
    
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