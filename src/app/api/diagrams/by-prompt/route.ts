import { NextResponse } from 'next/server';
import { getDiagramByPrompt } from '~/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt não fornecido' }, { status: 400 });
    }

    const diagram = await getDiagramByPrompt(prompt);
    if (!diagram) {
      return NextResponse.json({ error: 'Diagrama não encontrado' }, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error('Erro ao buscar diagrama:', error);
    return NextResponse.json({ error: 'Erro ao buscar diagrama' }, { status: 500 });
  }
} 