# conexion a la base de datos y funciones para las consultas
from motor.motor_asyncio import AsyncIOMotorClient
from models import Task
from bson import ObjectId
from datetime import datetime, timedelta, timezone

client = AsyncIOMotorClient('mongodb://localhost')
database = client.taskdatabase
collection = database.tasks

# Función para ajustar la hora a la zona horaria de Colombia
def ajustar_hora_colombia(fecha_utc):
    if fecha_utc:
        return fecha_utc.astimezone(timezone(timedelta(hours=-5)))  # Resta 5 horas para Colombia
    return None


# obtener una tarea por id
async def get_one_task_id(id: str):
    task = await collection.find_one({'_id': ObjectId(id)}) # Convertir id a ObjectId
    if task:
        task["_id"] = str(task["_id"])  # Convertir ObjectId a string
        task["created_at"] = ajustar_hora_colombia(task.get("created_at"))  # Ajustar fecha
        task["updated_at"] = ajustar_hora_colombia(task.get("updated_at"))  # Ajustar fecha
        return task
    return None  # Si no se encuentra, retornamos None, lo que permitirá que get_task maneje el error.

# buscar por titulo
async def get_one_task(title):
    task = await collection.find_one({"title": {"$regex": f".*{title}.*", "$options": "i"}})  # Búsqueda flexible
    
    if task:
        task["_id"] = str(task["_id"])  # Convertir ObjectId a string
        task["created_at"] = ajustar_hora_colombia(task.get("created_at"))
        task["updated_at"] = ajustar_hora_colombia(task.get("updated_at"))
        return task
    return None

# obtener todas las tareas creadas
async def get_all_tasks():
    task_cursor  =  collection.find({})
    tasks = await task_cursor.to_list(length=None)  # Convierte el cursor a una lista
    
    for task in tasks:
        task["_id"] = str(task["_id"])  # Convertimos ObjectId a string
        task["created_at"] = ajustar_hora_colombia(task.get("created_at"))
        task["updated_at"] = ajustar_hora_colombia(task.get("updated_at"))
    return tasks

# crear una tarea
async def create_task(task: Task):
    task_dict = task.dict(by_alias=True, exclude={"id"})  # Excluimos `id` si viene vacío
    task_dict["created_at"] = datetime.now(timezone.utc)  # Guardar en UTC
    task_dict["updated_at"] = None  # Inicialmente no tiene fecha por que no hay actualización
    
    new_task = await collection.insert_one(task_dict)  # Insertar en MongoDB
    created_task = await collection.find_one({"_id": new_task.inserted_id})  # Buscar la tarea creada

    if created_task:
        created_task["_id"] = str(created_task["_id"])
        created_task["created_at"] = ajustar_hora_colombia(created_task.get("created_at"))  # Convertir a hora colombiana
        created_task["updated_at"] = None  # Inicialmente no tiene fecha de actualización
        return created_task
    return None

# actualizar una tarea
async def update_task(id: str, data):
    task_update = {k: v for k, v in data.dict().items() if v is not None} # para que al momento de actualizar solo cambie y imprima los valores que se estan actualizando
    

    # 🔹 Agregar la fecha de actualización con la hora actual en UTC
    task_update["updated_at"] = datetime.now(timezone.utc)

    await collection.update_one({'_id': ObjectId(id)}, {'$set': task_update})
    document = await collection.find_one({'_id': ObjectId(id)})

    if document:
        document["_id"] = str(document["_id"])  # Convertimos ObjectId a string
        document["created_at"] = ajustar_hora_colombia(document.get("created_at"))
        document["updated_at"] = ajustar_hora_colombia(document.get("updated_at"))
        return document
    return None  # Si no se encuentra

# eliminar una tarea
async def delete_task(id: str):
    await collection.delete_one({'_id': ObjectId(id)})
    return True


