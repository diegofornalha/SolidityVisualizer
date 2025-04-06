import { NextResponse } from 'next/server';

// Armazenamento em memória para desenvolvimento
let diagrams = [
  {
    id: 1,
    title: 'Contrato ERC20 Básico',
    prompt: 'Crie um diagrama para um contrato ERC20 básico',
    diagram: `flowchart TD
      subgraph Blockchain
        ContratoPrincipal --> Proprietário
        ContratoPrincipal --> TokenERC20
        ContratoPrincipal --> Autorização
        
        subgraph Funções
          Transferência
          Emissão
          Queima
          Pausa
        end
        
        ContratoPrincipal --> Funções
        
        subgraph Eventos
          Transfer
          Approval
          Mint
          Burn
        end
        
        Funções --> Eventos
      end
      
      subgraph Interações
        Usuário --> ContratoPrincipal
        Usuário --> Interface
        Interface --> ContratoPrincipal
      end
      
      style ContratoPrincipal fill:#f96,stroke:#333
      style Funções fill:#69f,stroke:#333
      style Eventos fill:#6c9,stroke:#333`,
    apiKey: 'demo',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function POST(request: Request) {
  try {
    const { prompt, diagram, title } = await request.json();
    
    const id = diagrams.length > 0 ? Math.max(...diagrams.map(d => d.id)) + 1 : 1;
    const now = new Date();
    
    const newDiagram = {
      id,
      prompt,
      diagram,
      title: title || 'Diagrama sem título',
      apiKey: 'demo',
      createdAt: now,
      updatedAt: now
    };
    
    diagrams.push(newDiagram);
    return NextResponse.json(newDiagram);
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
        const diagram = diagrams.find(d => d.id === Number(id));
        if (!diagram) {
          return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
        }
        return NextResponse.json(diagram);
      } catch (error) {
        console.error('Erro ao buscar diagrama por ID:', error);
        return NextResponse.json({ error: 'Erro ao buscar diagrama' }, { status: 500 });
      }
    }

    return NextResponse.json(diagrams);
  } catch (error) {
    console.error('Erro ao buscar diagramas:', error);
    return NextResponse.json({ error: 'Erro ao buscar diagramas' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const index = diagrams.findIndex(d => d.id === Number(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
    }
    
    diagrams[index] = {
      ...diagrams[index],
      ...updates,
      updatedAt: new Date()
    };
    
    return NextResponse.json(diagrams[index]);
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

    const index = diagrams.findIndex(d => d.id === Number(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
    }
    
    const deletedDiagram = diagrams[index];
    diagrams = diagrams.filter(d => d.id !== Number(id));
    
    return NextResponse.json(deletedDiagram);
  } catch (error) {
    console.error('Erro ao excluir diagrama:', error);
    return NextResponse.json({ error: 'Erro ao excluir diagrama' }, { status: 500 });
  }
}
