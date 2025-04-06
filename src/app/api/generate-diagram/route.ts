import { NextResponse } from "next/server";

// Versão simplificada da API para funcionamento offline
export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt não fornecido" },
        { status: 400 }
      );
    }

    // Nesta versão simplificada, não vamos verificar a chave da API
    // para que o sistema funcione sem depender da OpenAI

    // Gerar um diagrama simplificado com base no prompt
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Detectar o tipo de diagrama com base nas palavras-chave
    let diagramType = "flowchart TD";
    if (words.some(w => w.includes("classe") || w.includes("class") || w.includes("uml") || w.includes("entidade"))) {
      diagramType = "classDiagram";
    } else if (words.some(w => w.includes("sequencia") || w.includes("sequence") || w.includes("message"))) {
      diagramType = "sequenceDiagram";
    } else if (words.some(w => w.includes("estado") || w.includes("state") || w.includes("transição"))) {
      diagramType = "stateDiagram-v2";
    } else if (words.some(w => w.includes("er") || w.includes("entity") || w.includes("banco de dados") || w.includes("database"))) {
      diagramType = "erDiagram";
    }

    // Gerar um diagrama de exemplo de contrato inteligente
    const diagram = `${diagramType}
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
    style Eventos fill:#6c9,stroke:#333`;

    // Gerar código Solidity de exemplo
    const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenExample is ERC20, Ownable {
    bool public paused;
    mapping(address => bool) public whitelist;
    
    event Paused(address account);
    event Unpaused(address account);
    event WhitelistAdded(address account);
    event WhitelistRemoved(address account);
    
    modifier whenNotPaused() {
        require(!paused, "Token: token transfer while paused");
        _;
    }
    
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Token: caller is not whitelisted");
        _;
    }
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Designate o criador do contrato como proprietário
        _transferOwnership(msg.sender);
        // Adicione o proprietário à whitelist
        whitelist[msg.sender] = true;
        emit WhitelistAdded(msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
    
    function pause() public onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    function addToWhitelist(address account) public onlyOwner {
        whitelist[account] = true;
        emit WhitelistAdded(account);
    }
    
    function removeFromWhitelist(address account) public onlyOwner {
        whitelist[account] = false;
        emit WhitelistRemoved(account);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused override {
        super._beforeTokenTransfer(from, to, amount);
    }
}`;

    // Gerar uma explicação simples do contrato
    const explanation = `Este contrato representa um token ERC20 com funcionalidades adicionais de segurança e controle:

1. **Características do Token:**
   - Implementa a interface ERC20 padrão com funções como transfer, approve, transferFrom
   - Herda do contrato Ownable para controle de acesso a funções administrativas

2. **Mecanismos de Segurança:**
   - Função de pausa que pode interromper todas as transferências em caso de emergencia
   - Sistema de whitelist para permitir acesso a funções restritas
   - Modificadores personalizados para verificar estado e permissões

3. **Gerenciamento de Tokens:**
   - Capacidade de cunhar (mint) novos tokens, restrita ao proprietário
   - Função burn para destruir tokens, disponível para qualquer usuário queimar seus próprios tokens

4. **Eventos:**
   - Eventos para pausa/retomada do contrato
   - Eventos para adição/remoção da whitelist
   - Eventos padrão do ERC20 (Transfer, Approval)`;

    return NextResponse.json({
      diagram_code: diagram,
      solidity_code: solidityCode,
      explanation: explanation
    });

  } catch (error) {
    console.error("Erro ao gerar diagrama:", error);
    return NextResponse.json(
      { error: "Erro ao gerar o diagrama" },
      { status: 500 }
    );
  }
}
