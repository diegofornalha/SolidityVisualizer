import { NextResponse } from 'next/server';
import { saveDiagram, getAllDiagrams, getDiagramById, updateDiagram, deleteDiagram } from '~/db/queries';

export async function POST(request: Request) {
  try {
    const { prompt, diagram, title } = await request.json();
    const savedDiagram = await saveDiagram(prompt, diagram, title);
    return NextResponse.json(savedDiagram);
  } catch (error) {
    console.error('Erro ao salvar diagrama:', error);
    return NextResponse.json({ error: 'Erro ao salvar diagrama' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      try {
        const diagram = await getDiagramById(Number(id));
        if (!diagram) {
          return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
        }
        return NextResponse.json(diagram);
      } catch (error) {
        console.error('Erro ao buscar diagrama por ID:', error);
        return NextResponse.json({ error: 'Erro ao buscar diagrama' }, { status: 500 });
      }
    }

    try {
      const diagrams = await getAllDiagrams();
      return NextResponse.json(diagrams);
    } catch (error) {
      console.error('Erro ao buscar diagramas do banco:', error);
      // Retornar dados fake para quando o banco não estiver disponível
      const mockDiagrams = [
        {
          id: 1,
          title: 'teste',
          prompt: 'Crie um diagrama de fluxo simples para um sistema de agendamento com 4 etapas: 1. Início: Solicitação 2. Processo: Verificação de disponibilidade 3. Processo: Confirmação 4. Fim: Agendamento concluído Use flowchart TD (top-down) com cores básicas.',
          diagram: `flowchart TD
            A([Início]) --> B[Receber Solicitação]
            B --> C{Validar Dados}
            C -->|Válidos| D[Processar]
            C -->|Inválidos| E[Solicitar Correção]
            E --> B
            D --> F[Gerar Resultado]
            F --> G([Fim])`,
          created_at: new Date().toISOString(),
        }
      ];
      return NextResponse.json(mockDiagrams);
    }
  } catch (error) {
    console.error('Erro ao buscar diagramas:', error);
    return NextResponse.json({ error: 'Erro ao buscar diagramas' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const updatedDiagram = await updateDiagram(Number(id), updates);
    if (!updatedDiagram.length) {
      return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedDiagram[0]);
  } catch (error) {
    console.error('Erro ao atualizar diagrama:', error);
    return NextResponse.json({ error: 'Erro ao atualizar diagrama' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    const deletedDiagram = await deleteDiagram(Number(id));
    if (!deletedDiagram.length) {
      return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
    }
    return NextResponse.json(deletedDiagram[0]);
  } catch (error) {
    console.error('Erro ao excluir diagrama:', error);
    return NextResponse.json({ error: 'Erro ao excluir diagrama' }, { status: 500 });
  }
} 