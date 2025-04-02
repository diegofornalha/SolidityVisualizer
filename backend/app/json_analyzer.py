import json
import sys
from pathlib import Path

def generate_workflow_diagram(json_data):
    """Gera um diagrama Mermaid focado no fluxo de trabalho do agendamento."""
    nodes = json_data.get('nodes', [])
    connections = json_data.get('connections', {})
    
    # Mapear nós por ID
    node_map = {node['id']: node for node in nodes}
    
    # Iniciar diagrama Mermaid
    mermaid = [
        "sequenceDiagram",
        "    participant User as Usuário",
        "    participant Chat as Chat Trigger",
        "    participant AI as AI Agent",
        "    participant Calendar as Google Calendar"
    ]
    
    # Adicionar interações baseadas nas conexões
    for node_id, node_data in node_map.items():
        node_type = node_data.get('type', '')
        node_name = node_data.get('name', '')
        
        if node_name == "When chat message received":
            mermaid.append("    User ->> Chat: Envia mensagem")
            mermaid.append("    Chat ->> AI: Processa mensagem")
        
        elif "googleCalendarTool" in node_type:
            if node_name == "Agendar":
                mermaid.append("    AI ->> Calendar: Criar evento")
                mermaid.append("    Calendar -->> AI: Evento criado")
            elif node_name == "Consultar":
                mermaid.append("    AI ->> Calendar: Consultar eventos")
                mermaid.append("    Calendar -->> AI: Lista de eventos")
            elif node_name == "Deletar":
                mermaid.append("    AI ->> Calendar: Deletar evento")
                mermaid.append("    Calendar -->> AI: Evento deletado")
    
    mermaid.append("    AI -->> User: Resposta")
    
    return "\n".join(mermaid)

def main(json_file_path):
    """Função principal que processa o arquivo JSON."""
    try:
        # Ler o arquivo JSON
        with open(json_file_path, 'r') as f:
            json_data = json.load(f)
        
        # Gerar diagrama do fluxo de trabalho
        workflow_diagram = generate_workflow_diagram(json_data)
        
        # Imprimir o diagrama
        print("\nDiagrama do Fluxo de Trabalho:")
        print("```mermaid")
        print(workflow_diagram)
        print("```")
        
        # Análise adicional
        print("\nComponentes do Sistema:")
        if "nodes" in json_data:
            components = []
            for node in json_data['nodes']:
                name = node.get('name', '')
                type_ = node.get('type', '').split('.')[-1]
                if name and type_:
                    components.append(f"- {name} ({type_})")
            
            print("\n".join(sorted(components)))
        
    except json.JSONDecodeError:
        print("Erro: O arquivo não contém JSON válido")
    except FileNotFoundError:
        print("Erro: Arquivo não encontrado")
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python json_analyzer.py <caminho_do_arquivo.json>")
    else:
        main(sys.argv[1]) 