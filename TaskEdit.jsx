// - Formulario para editar tareas
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getTaskById, updateTask } from '../services/api';

function TaskEdit() {
    const {id} = useParams(); // obtiene el ID de la tarea desde la URL
    const navigate = useNavigate(); // para redirigir despues de editar
    
    const [task, setTask] = useState({
        title: "",
        description: "",
        completed: false,
        created_at: "",
        updated_at: ""
    });

    useEffect(() => {
        // buscar la tarea
        async function fetchTask() {
            const data = await getTaskById(id);
            if (data) {
                setTask(data);
            } else {
                Swal.fire("Error", "No se encontró la tarea.", "error");
                navigate("/");
            }
        }
        fetchTask();
    }, [id, navigate]);

    // marcar como completada o no
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setTask({
            ...task,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Obtener la fecha en formato ISO (para la base de datos)
    const obtenerFechaISO = () => {
        return new Date().toISOString(); // Guardar en UTC para evitar errores en MongoDB
    };

    const formatFechaColombiana = (fecha) => {
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

    // Actualizar tarea
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const tareaActualizada = {
            ...task,
            updated_at: obtenerFechaISO() // 🔹 Se actualiza con la fecha actual en formato UTC
    };
    try {
        await updateTask(id, tareaActualizada);
        Swal.fire("Actualizado!", "La tarea ha sido modificada.", "success");
        navigate("/");
    } catch (error) {
        Swal.fire("Error", "No se pudo actualizar la tarea.", "error");
        console.error("Error al actualizar:", error);
    }

    };

    return (
        <div className='container'>
            <h2>Editar Tarea</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="title">Titulo</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="description">Descripción:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="created_at">Fecha de Creación:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="created_at"
                        value={formatFechaColombiana(task.created_at)}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="updated_at">Última Actualización:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="updated_at"
                        value={task.updated_at ? formatFechaColombiana(task.updated_at) : "Aún no ha sido actualizada"}
                        disabled
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="completed"
                        name="completed"
                        checked={task.completed}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="completed">¿Completada?</label>
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Cancelar</button>
            </form>
        </div>
    );
}

export default TaskEdit;