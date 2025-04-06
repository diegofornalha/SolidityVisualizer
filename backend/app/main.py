from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, generate, smart_contract
from app.database import get_db
from sqlalchemy.orm import Session
from app.crud import get_user_by_email
from fastapi.security import OAuth2PasswordBearer
import os

app = FastAPI()

# Configuração de origens permitidas para CORS
origins = [
    "http://localhost:3000",
    "https://solidityvisualizer.com",
    "https://www.solidityvisualizer.com",
    "https://solidityvisualizer.vercel.app",
    "https://solidity-visualizer.vercel.app"
]

# Adicionar middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API
app.include_router(auth.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(smart_contract.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "SolidityVisualizer API está funcionando!", "docs": "/docs"}

# Verificar se estamos em ambiente de desenvolvimento
if os.environ.get("ENV") == "dev":
    @app.get("/test-db")
    def test_db(db: Session = Depends(get_db)):
        try:
            # Tentar fazer uma consulta simples
            user = get_user_by_email(db, "test@example.com")
            return {"message": "Conexão com o banco de dados funcionando!", "user_found": user is not None}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao conectar com o banco de dados: {str(e)}"
            )
