//  Funciones para llamar a la API 
const API_URL = "http://localhost:8000/api/tasks";

// obtener la lista de tareas
export async function getTasks() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener las tareas");
    return response.json();
}

// crear una tarea
export async function createTask(task) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Obtiene el mensaje de error del backend
            throw new Error(`Error al crear la tarea: ${errorData.detail || "Error desconocido"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createTask:", error);
        throw error;
    }
}

// buscar por id
export async function getTaskById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Error al obtener la tarea por ID: ${id}` );
    return response.json();
}

// Buscar por título (corregido)
export async function getTaskByTitle(title) {
    const response = await fetch(`${API_URL}/search?title=${encodeURIComponent(title)}` ,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Error al obtener la tarea con este titulo: ${title}`);

    return await response.json();
}

// actualizar tarea
export async function updateTask(id, task) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Error al actualizar la tarea");
}

// eliminar una tarea
export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la tarea");
}