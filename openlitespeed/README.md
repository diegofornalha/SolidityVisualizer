# Configuração do OpenLiteSpeed para SolidityVisualizer

Este diretório contém os arquivos necessários para configurar o OpenLiteSpeed como servidor web para a API do SolidityVisualizer, substituindo o NGINX do projeto original.

## Arquivos Incluídos

- `vhost.conf`: Configuração do host virtual para OpenLiteSpeed
- `install_ols.sh`: Script para instalar e configurar o OpenLiteSpeed
- `setup_python_app.sh`: Script para configurar a aplicação Python com o OpenLiteSpeed

## Instruções de Instalação

### 1. Instalar OpenLiteSpeed

```bash
sudo chmod +x install_ols.sh
sudo ./install_ols.sh
```

Isso irá:
- Instalar o OpenLiteSpeed no servidor
- Configurar um host virtual para a API
- Configurar as regras de redirecionamento HTTP para HTTPS

### 2. Configurar a Aplicação Python

```bash
sudo chmod +x setup_python_app.sh
sudo ./setup_python_app.sh
```

Isso irá:
- Copiar a aplicação Python para o diretório apropriado
- Configurar um ambiente virtual Python
- Instalar as dependências necessárias
- Configurar e iniciar um serviço systemd para a aplicação

### 3. Configurar SSL (se necessário)

Se você ainda não tem certificados SSL:

```bash
sudo apt-get install -y certbot
sudo certbot certonly --standalone -d api.flowagents.com
```

### 4. Verificar a Instalação

Para verificar se tudo está funcionando corretamente:

```bash
# Verificar o status do OpenLiteSpeed
sudo systemctl status lsws

# Verificar o status da aplicação Python
sudo systemctl status solidity-api
```

## Painel de Administração

O OpenLiteSpeed inclui um painel de administração web:

- URL: https://seu-servidor:7080
- Nome de usuário padrão: admin
- Para obter a senha: `cat /usr/local/lsws/adminpasswd`

## Diferenças em Relação ao NGINX

O OpenLiteSpeed oferece algumas vantagens sobre o NGINX:

1. Interface administrativa gráfica para gerenciamento de configurações
2. Melhor desempenho e menor consumo de memória
3. Suporte nativo a HTTP/3 e QUIC
4. Cache mais avançado
5. Recursos incorporados de segurança e otimização de desempenho 