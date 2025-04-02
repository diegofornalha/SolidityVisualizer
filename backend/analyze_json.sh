#!/bin/bash

# Ativar o ambiente virtual
source venv/bin/activate

# Verificar se um arquivo foi fornecido como argumento
if [ $# -eq 0 ]; then
    echo "Por favor, forneça o caminho do arquivo JSON como argumento."
    echo "Uso: ./analyze_json.sh <caminho_do_arquivo.json>"
    exit 1
fi

# Executar o script Python
python app/json_analyzer.py "$1" 