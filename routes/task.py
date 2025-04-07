# rutas para las peticiones CRUD
from fastapi import APIRouter, HTTPException
from database import get_all_tasks, create_task, get_one_task, get_one_task_id, delete_task, update_task
from models import Task, UpdateTask

task =  APIRouter()
# obtener todas las tareas
@task.get('/tasks')
async def get_tasks():
    tasks = await get_all_tasks()
    if tasks:
        return tasks
    raise HTTPException(404, f"la lista esta vacia: {[]}")

# crear una tarea
@task.post('/tasks', response_model=Task)
async def save_task(task: Task):
    print(f"Datos recibidos en POST: {task}")

    task_found = await get_one_task(task.title)
    if task_found:
        raise HTTPException(status_code=409, detail="La tarea ya existe")
    
    response = await create_task(task)
    if response:
        return response
    
    raise HTTPException(status_code=400, detail="No se pudo guardar la tarea")

# buscar tarea por titulo
@task.get("/tasks/search", response_model=Task)
async def search_task(title: str):
    task = await get_one_task(title)
    if task:
        return task
    raise HTTPException(404, f"Tarea con este titulo: {title}, no encontrada")

# obtener una tarea por su id
@task.get('/tasks/{id}', response_model=Task)
async def get_task(id: str):
    task = await get_one_task_id(id)
    if task:
        return task
    raise HTTPException(404, f"Tarea con id {id} no encontrada")



# actualizar una tarea
@task.put('/tasks/{id}')
async def put_task(id: str, task: UpdateTask):
    response = await update_task(id, task)
    if response:
        return response
    return HTTPException(404, f"Tarea con id {id} no encontrada")

#eliminar una tarea
@task.delete('/tasks/{id}')
async def remove_task(id: str):
    response = await delete_task(id)
    if response:
        return "Tarea eliminada exitosamente"
    raise HTTPException(404, f"Tarea con id {id} no encontrada")