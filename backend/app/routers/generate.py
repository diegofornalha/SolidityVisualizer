from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.schemas import SmartContractCreate, SmartContractResponse
from app.services.openai_service import generate_diagram_from_description, analyze_smart_contract
from app.crud import create_smart_contract, get_smart_contracts_by_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.models import User
import time

router = APIRouter()

class DiagramRequest(BaseModel):
    description: str
    style: Optional[str] = "simple"
    additional_info: Optional[Dict[str, Any]] = None

class DiagramResponse(BaseModel):
    diagram_code: str
    solidity_code: str
    explanation: str

class AnalyzeRequest(BaseModel):
    solidity_code: str
    include_security_analysis: Optional[bool] = True

class AnalysisResponse(BaseModel):
    diagram_code: str
    explanation: str
    security_issues: Optional[List[Dict[str, Any]]] = None

@router.post("/generate-diagram", response_model=DiagramResponse)
async def generate_diagram(request: DiagramRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # Gerar o diagrama e código Solidity a partir da descrição
        result = await generate_diagram_from_description(request.description, request.style, request.additional_info)
        
        # Salvar no banco de dados em segundo plano
        if current_user:
            contract = SmartContractCreate(
                title=f"Contrato gerado em {time.strftime('%d/%m/%Y %H:%M')}",
                description=request.description,
                solidity_code=result["solidity_code"],
                diagram_code=result["diagram_code"],
                additional_notes=result["explanation"]
            )
            background_tasks.add_task(create_smart_contract, db=db, contract=contract, user_id=current_user.id)
        
        return DiagramResponse(
            diagram_code=result["diagram_code"],
            solidity_code=result["solidity_code"],
            explanation=result["explanation"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar o diagrama: {str(e)}"
        )

@router.post("/analyze-contract", response_model=AnalysisResponse)
async def analyze_contract(request: AnalyzeRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    try:
        # Analisar o contrato Solidity
        result = await analyze_smart_contract(request.solidity_code, request.include_security_analysis)
        
        # Salvar no banco de dados em segundo plano se o usuário estiver autenticado
        if current_user:
            contract = SmartContractCreate(
                title=f"Análise de contrato em {time.strftime('%d/%m/%Y %H:%M')}",
                description="Análise de código Solidity",
                solidity_code=request.solidity_code,
                diagram_code=result["diagram_code"],
                additional_notes=result["explanation"]
            )
            background_tasks.add_task(create_smart_contract, db=db, contract=contract, user_id=current_user.id)
        
        return AnalysisResponse(
            diagram_code=result["diagram_code"],
            explanation=result["explanation"],
            security_issues=result.get("security_issues")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao analisar o contrato: {str(e)}"
        )

@router.get("/user-contracts", response_model=List[SmartContractResponse])
async def get_user_contracts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        contracts = get_smart_contracts_by_user(db, current_user.id)
        return contracts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar contratos do usuário: {str(e)}"
        )
