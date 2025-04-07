//  Formulario para crear tareas
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createTask } from "../services/api";

function TaskForm(){
    const navigate = useNavigate(); // para redirigir despues de crear la tarea
    
    
    const [task, setTask] = useState({
        title: "",
        description: "",
        completed: false,
    });

    // manejar el cambio en el checkbox
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setTask({
            ...task,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Convertir la fecha a hora colombiana (GMT-5)
    const fechaColombia = (fecha) => {
        if (!fecha) return "No disponible";
        
        let fechaLocal = new Date(fecha);
        fechaLocal.setHours(fechaLocal.getHours() - 5); // Restar 5 horas para ajustar a GMT-5
        
        return fechaLocal.toLocaleString("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    // crear tarea
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!task.title.trim()) {
            Swal.fire("Error", "El título de la tarea es obligatorio.", "error");
            return;
        }

        const newTask = {
            ...task,
            created_at: new Date().toISOString(), // Guardar en UTC
        }; 
        
        try {
            await createTask(newTask);
            Swal.fire("Creada!", "La tarea ha sido agregada.", "success");
            navigate("/");
        } catch (error) {
            Swal.fire("Error", "No se pudo crear la tarea.", "error");
            console.error("Error al crear la tarea:", error);
        }
    };

    return (
        <div className="container">
            <h2>Crear Nueva Tarea</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="task-title" className="form-label">Título:</label>
                    <input
                        type="text"
                        id="task-title"
                        className="form-control"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="task-description" className="form-label">Descripción:</label>
                    <textarea
                        id="task-description"
                        className="form-control"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="task-created-at" className="form-label">Fecha de Creación:</label>
                    <input
                        type="text"
                        id="task-created-at"
                        className="form-control"
                        value={fechaColombia(new Date())} // Muestra la fecha actual en hora colombiana
                        disabled
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        id="task-completed"
                        className="form-check-input"
                        name="completed"
                        checked={task.completed}
                        onChange={handleChange}
                    />
                    <label htmlFor="task-completed" className="form-check-label">¿Marcar como completada?</label>
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Cancelar</button>
            </form>
        </div>
    );
}

export default TaskForm;