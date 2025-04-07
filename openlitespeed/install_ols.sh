#!/bin/bash

# Exit on any error
set -e

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Instalar OpenLiteSpeed e dependências
echo "Instalando OpenLiteSpeed..."
wget -O - https://rpms.litespeedtech.com/debian/enable_lst_debian_repo.sh | bash
apt-get update
apt-get install -y openlitespeed

# Criar diretório para o virtual host
VHOST_DIR="/usr/local/lsws/conf/vhosts/api"
mkdir -p "$VHOST_DIR"

# Copiar arquivo de configuração do vhost
echo "Configurando host virtual..."
cp "$(dirname "$0")/vhost.conf" "$VHOST_DIR/vhost.conf"

# Adicionar configuração ao arquivo principal
echo "Incluindo configuração no arquivo principal..."
MAIN_CONF="/usr/local/lsws/conf/httpd_config.conf"
grep -q "configFile.*$VHOST_DIR/vhost.conf" "$MAIN_CONF" || {
  # Procurar a seção de Virtual Hosts
  LINENUM=$(grep -n "virtualHost " "$MAIN_CONF" | tail -1 | cut -d: -f1)
  
  # Adicionar nossa configuração após a última definição de virtualHost
  sed -i "${LINENUM}a\\
virtualHost api {\\
  vhRoot                  /var/www/api\\
  configFile              $VHOST_DIR/vhost.conf\\
  allowSymbolLink         1\\
  enableScript            1\\
  restrained              0\\
}\\
" "$MAIN_CONF"
}

# Criar diretório do site
mkdir -p /var/www/api/html
echo "<html><body><h1>API está funcionando!</h1></body></html>" > /var/www/api/html/index.html
chown -R nobody:nogroup /var/www/api

# Reiniciar OpenLiteSpeed
echo "Reiniciando OpenLiteSpeed..."
systemctl restart lsws

echo "OpenLiteSpeed foi configurado com sucesso!"
echo "Painel de administração: https://seu-servidor:7080"
echo "Nome de usuário padrão: admin"
echo "Para obter a senha, execute: cat /usr/local/lsws/adminpasswd" 