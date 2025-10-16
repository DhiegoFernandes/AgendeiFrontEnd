import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home/home";
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
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
// import { PrivateRoute } from './privateRoute';

function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />

                <Route path="/cliente/comercios" element={<Comercios />} />
                <Route path='/cliente/escolher-servico' element={<EscolherServico />} />
                <Route path='/cliente/agendar-horario' element={<AgendarHorario />} />
                <Route path='/cliente/agendamento' element={<AgendamentosCliente />} />
                <Route path='/cliente/dados' element={<DadosCliente />} />
                <Route path='/cliente/perfil' element={<PerfilCliente />} />
                <Route path='/cliente/fazer-avaliacao' element={<FazerAvaliacao />} />
                <Route path='/cliente/alterar-dados' element={<AlterarDadosCliente />} />

                <Route path='/prestador/criar-negocio' element={<InicioParceiro />} />
                <Route path='/parceiro/perfil' element={<PerfilParceiro />} />
                <Route path='/parceiro/agendamento' element={<AgendamentoParceiro />} />
                <Route path='/parceiro/relatorio' element={<RelatorioParceiro />} />
                <Route path='/parceiro/servicos' element={<ServicosParceiro />} />
                <Route path='/parceiro/dados' element={<DadosParceiro />} />
                <Route path='/parceiro/alterar-dados' element={<AlterarDadosParceiro />} />
                <Route path='/parceiro/avaliações' element={<AvaliacoesParceiro />} />
                <Route path='/parceiro/gerenciar-negocio' element={<GerenciarNegocio />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;