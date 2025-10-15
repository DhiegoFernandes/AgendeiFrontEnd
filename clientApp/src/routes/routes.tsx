import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home/home";
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
import InicioCliente from '../pages/InicioCliente/inicioCliente';
import InicioParceiro from '../pages/InicioParceiro/inicioParceiro';
import Comercios from '../pages/comercios/comercios';
import EscolherServico from '../pages/EscolherServico/escolherServico';
import AgendarHorario from '../pages/AgendarHorario/agendarHorario';
import AgendamentosCliente from '../pages/AgendamentoCliente/agendamentoCliente';
import DadosCliente from '../pages/DadosCliente/dadosCliente';
import PerfilCliente from '../pages/PerfilCliente/perfilCliente';
import FazerAvaliacao from '../pages/FazerAvaliacao/fazerAvaliacao';
import PerfilParceiro from '../pages/PerfilParceiro/perfilParceiro';
import AlterarDadosCliente from '../pages/AlterarDadosCliente/alterarDadosCliente';
import AgendamentoParceiro from '../pages/AgendamentoParceiro/agendamentoParceiro';
import RelatorioParceiro from '../pages/RelatorioParceiro/relatorioParceiro';
import ServicosParceiro from '../pages/ServicosParceiro/servicosParceiro';
import DadosParceiro from '../pages/DadosParceiro/dadosParceiro';
import AlterarDadosParceiro from '../pages/AlterarDadosParceiro/alterarDadosParceiro';
import AvaliacoesParceiro from '../pages/AvaliacoesParceiro/avaliacoesParceiro';
import GerenciarNegocio from '../pages/GerenciarNegocio/gerenciarNegocio';






function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/cliente' element={<InicioCliente />} />
                <Route path='/inicioParceiro' element={<InicioParceiro />} />
                <Route path="/comercios" element={<Comercios />} />
                <Route path='/escolherservico' element={<EscolherServico />} />
                <Route path='/agendarhorario' element={<AgendarHorario />} />
                <Route path='/agendamentocliente' element={<AgendamentosCliente />} />
                <Route path='/dadosCliente' element={<DadosCliente />} />
                <Route path='/perfilCliente' element={<PerfilCliente />} />
                <Route path='/fazerAvaliacao' element={<FazerAvaliacao />} />
                <Route path='/alterarDadosCliente' element={<AlterarDadosCliente />} />

                <Route path='/perfilParceiro' element={<PerfilParceiro />} />
                <Route path='/agendamentoParceiro' element={<AgendamentoParceiro />} />
                <Route path='/relatorioParceiro' element={<RelatorioParceiro />} />
                <Route path='/servicosParceiro' element={<ServicosParceiro />} />
                <Route path='/dadosParceiro' element={<DadosParceiro />} />
                <Route path='/alterarDadosParceiro' element={<AlterarDadosParceiro />} />
                <Route path='/avaliacoesParceiro' element={<AvaliacoesParceiro />} />
                <Route path='/gerenciarNegocio' element={<GerenciarNegocio />} />
 

            </Routes>
        </Router>
    )
}

export default AppRoutes;