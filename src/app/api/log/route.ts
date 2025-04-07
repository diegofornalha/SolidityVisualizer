import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    
    // Registra o erro no console do servidor com formatação clara
    console.log('\n------- ERRO DO CLIENTE -------');
    console.log(`Mensagem: ${logData.message}`);
    console.log(`Erro: ${logData.error}`);
    console.log(`Timestamp: ${logData.timestamp}`);
    
    if (logData.stack) {
      console.log('\nStack Trace:');
      console.log(logData.stack);
    }
    console.log('--------------------------------\n');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log:', error);
    return NextResponse.json({ success: false, error: 'Falha ao processar log' }, { status: 500 });
  }
} 