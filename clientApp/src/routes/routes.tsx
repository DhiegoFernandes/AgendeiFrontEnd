import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home/home";
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
import InicioCliente from '../pages/InicioCliente/inicioCliente';
import InicioPrestador from '../pages/InicioPrestador/inicioPrestador';

function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/cliente' element={<InicioCliente />} />
                <Route path='/prestador' element={<InicioPrestador />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;