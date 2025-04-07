import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from "./components/Navbar";
import TaskEdit from "./pages/TaskEdit";
import TaskForm from './pages/TaskForm';
import TaskList from "./pages/TaskList";

function App() {
  return (
    <Router>
      <NavigationBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<TaskList/>} />
            <Route path="/new" element={<TaskForm/>} />
            <Route path="/edit/:id" element={<TaskEdit/>} />
          </Routes>
        </div>
    </Router>
  );
}

export default App