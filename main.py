
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.task import task

app = FastAPI()

# Configuración de CORS para permitir peticiones desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Dirección del frontend en desarrollo
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Permitir todos los encabezados
)

@app.get('/')
def welcome():
    return{'message':'Bienvenido a mi API de FastAPI!'}

app.include_router(task, prefix="/api")
    
