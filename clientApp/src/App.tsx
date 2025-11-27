import AppRoutes from "./routes/routes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <AppRoutes />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App;
