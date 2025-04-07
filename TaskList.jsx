// Listar, buscar por título o ID, eliminar, editar y marcar como completada
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteTask, getTaskById, getTaskByTitle, getTasks, updateTask } from '../services/api';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]); // 🔹 Para mostrar solo los resultados de la búsqueda


    useEffect(() => {

        // lista de todas las tareas
        async function fetchData() {
            const data = await getTasks();
            setTasks(data);
            setFilteredTasks(data); // Al inicio, filteredTasks es igual a tasks
        }
        fetchData();
    }, []);

    // eliminar tarea
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar!"
        });

        if (confirmDelete.isConfirmed) {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
            setFilteredTasks(filteredTasks.filter(task => task._id !== id)); // 🔹 También eliminamos de los resultados de búsqueda
            Swal.fire("Eliminado!", "La tarea ha sido eliminada.", "success");
        }
    };

    // editar y marcar como completada
    const toggleComplete = async (task) => {
        const updatedTask = { ...task, completed: !task.completed};
        await updateTask(task._id, updatedTask);
        setTasks(tasks.map(t => t._id === task._id ? updatedTask: t));
        setFilteredTasks(filteredTasks.map(t => (t._id === task._id ? updatedTask : t)));

        Swal.fire({
            title: "Estado actualizado!",
            text: task.completed ?
            "La tarea se ha marcado como pendiente."
            : "La tarea se ha marcado como completada.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    };

    // ✅ Búsqueda flexible por título o ID
    const handleSearch = async () => {
        try {
            if (!searchQuery.trim()) {
                setFilteredTasks(tasks); // 🔹 Restaurar lista completa automáticamente
                return;
            }
    
        
    
            let result;
            if (/^[0-9a-fA-F]{24}$/.test(searchQuery)) { // 🔹 Si es un ID válido
                // 🔹 Buscamos por ID
                const task = await getTaskById(searchQuery);
                result = task ? [task] : []; //  Convertimos a array para usar el map()
            } else {
                // 🔹 Buscamos por título
                result = await getTaskByTitle(searchQuery);
                
            }
    
            if (!result || result.length === 0) {
                setFilteredTasks([]); // 🔹 Limpiamos los resultados
                Swal.fire("No encontrado", "No se encontró la tarea.", "warning");
                return;
            }
    
            setFilteredTasks(Array.isArray(result) ? result : [result]); // Actualiza el estado de las tareas filtradas, solo con los resultados de busqueda
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            Swal.fire("Error", "No se pudo realizar la búsqueda.", "error");
        }
    };

    //Formatear fecha a hora colombiana
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

    return (
        <div>
            <h2>Lista de Tareas</h2>

            {/* Barra de búsqueda única */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Buscar por título o ID"
                    value={searchQuery}
                    onChange={(e) =>{
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()){
                            setFilteredTasks(tasks); //  Restaurar lista completa automáticamente
                        }
                    }}
                />
                    <button className="btn btn-primary me-2" onClick={handleSearch}>Buscar</button>
            </div>

            <ul className="list-group">
                {Array.isArray(filteredTasks) && filteredTasks.map((task) => {
                    return (
                    <li key={task._id} className="list-group-item position-relative">
                        {/* Botón en la esquina superior derecha para marcar como completada */}
                        <button
                            onClick={() => toggleComplete(task)}
                            className="btn position-absolute top-0 end-0 m-2"
                            style={{ borderRadius: "50%", width: "20px", height: "20px", backgroundColor: task.completed ? "green" : "red" }}
                            >
                        </button>
                        <div>
                            <strong>ID:</strong> {task._id} <br/>
                            <strong>Título:</strong> {task.title} <br/>
                            <strong>Descripción:</strong> {task.description || "Sin descripción"} <br/>
                            <strong>Estado:</strong> {task.completed ? "Completada" : "Pendiente"} <br/>
                            <strong>Creada el:</strong>  {formatFechaColombiana(task.created_at)} <br/>
                            <strong>Actualizada el:</strong> {formatFechaColombiana(task.updated_at)} <br/>
                        </div>

                        <div className="d-flex justify-content-end mt-2">
                            <Link to={`/edit/${task._id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                            <button onClick={() => handleDelete(task._id)} className="btn btn-danger btn-sm">Eliminar</button>
                        </div>
                    </li>
                    );
                })}
            </ul>
        </div>
    );

}

export default TaskList;