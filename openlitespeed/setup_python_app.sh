#!/bin/bash

# Exit on any error
set -e

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "Por favor, execute como root ou com sudo"
    exit 1
fi

# Definir variáveis do ambiente
APP_DIR="/var/www/api/python_app"
BACKEND_DIR="$(dirname "$(dirname "$0")")"

# Criar diretório de aplicação se não existir
echo "Criando diretório da aplicação..."
mkdir -p "$APP_DIR"

# Copiar a aplicação Python para o diretório de destino
echo "Copiando aplicação Python..."
cp -r "$BACKEND_DIR/app" "$APP_DIR/"
cp "$BACKEND_DIR/requirements.txt" "$APP_DIR/"
cp "$BACKEND_DIR/entrypoint.sh" "$APP_DIR/"
chmod +x "$APP_DIR/entrypoint.sh"

# Configurar ambiente Python
echo "Configurando ambiente Python..."
apt-get update
apt-get install -y python3-venv python3-pip

# Criar e ativar ambiente virtual
cd "$APP_DIR"
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
echo "Instalando dependências Python..."
pip install -r requirements.txt

# Configurar o ambiente de produção
echo "export ENVIRONMENT=production" > "$APP_DIR/.env"

# Criar arquivo de serviço systemd
echo "Configurando serviço systemd..."
cat > /etc/systemd/system/solidity-api.service << EOF
[Unit]
Description=SolidityVisualizer API Service
After=network.target

[Service]
User=nobody
Group=nogroup
WorkingDirectory=$APP_DIR
Environment=PYTHONPATH=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=$APP_DIR/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# Recarregar systemd, habilitar e iniciar o serviço
systemctl daemon-reload
systemctl enable solidity-api.service
systemctl start solidity-api.service

echo "Aplicação Python configurada e iniciada com sucesso!"
echo "Verifique o status com: systemctl status solidity-api.service" 