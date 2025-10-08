import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home/home";
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
import InicioCliente from '../pages/InicioCliente/inicioCliente';
import InicioPrestador from '../pages/InicioPrestador/inicioPrestador';
import Comercios from '../pages/comercios/comercios';
import EscolherServico from '../pages/EscolherServico/escolherServico';
import AgendarHorario from '../pages/AgendarHorario/agendarHorario';
import AgendamentosCliente from '../pages/AgendamentoCliente/agendamentoCliente';
import DadosCliente from '../pages/DadosCliente/dadosCliente';
import PerfilCliente from '../pages/PerfilCliente/perfilCliente';
import FazerAvaliacao from '../pages/FazerAvaliacao/fazerAvaliacao';
import { PrivateRoute } from './privateRoute';


function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/cliente' 
                    element={
                        <PrivateRoute>
                          <InicioCliente />  
                        </PrivateRoute>
                    } 
                />
                <Route path='/prestador' 
                    element={
                        <PrivateRoute>
                          <InicioPrestador />  
                        </PrivateRoute>
                    } 
                />
                <Route path="/comercios" element={<Comercios />} />
                <Route path='/escolherservico' element={<EscolherServico />} />
                <Route path='/agendarhorario' element={<AgendarHorario />} />
                <Route path='/agendamentocliente' element={<AgendamentosCliente />} />
                <Route path='/dadosCliente' element={<DadosCliente />} />
                <Route path='/perfilCliente' element={<PerfilCliente />} />
                <Route path='/fazerAvaliacao' element={<FazerAvaliacao />} />
 

            </Routes>
        </Router>
    )
}

export default AppRoutes;