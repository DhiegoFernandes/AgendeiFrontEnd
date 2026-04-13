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
import HorarioDeTrabalhoParceiro from '../pages/HorarioDeTrabalhoParceiro/horarioDeTrabalhoParceiro';
import ADMNavBar from '../pages/ADM/ADMNavBar';
import ClienteADM from '../pages/ADM/ClienteADM/clienteAdm';
import ConfiguracaoADM from '../pages/ADM/ConfiguracaoADM/configuracaoAdm';
import PainelADM from '../pages/ADM/PainelADM/painelAdm';
import ParceiroADM from '../pages/ADM/ParceiroADM/parceiroAdm';
import ServicosADM from '../pages/ADM/ServicosADM/servicosAdm';
import PoliticaPrivacidade from '../pages/PoliticaPrivacidade/politicaPrivacidade';
import GerenciarPerfilParceiro from '../pages/GerenciarPerfilParceiro/gerenciarPerfilParceiro';
import EscolhaPrestador from '../pages/EscolhaPrestador/escolhaPrestador';
import AssinaturaPlano from '../pages/AssinaturaPlano/assinaturaPlano';
import UsuariosBloqueados from '../pages/UsuariosBloqueados/usuariosBloqueados';
import EsqueceuSenha from '../pages/EsqueceuSenha/esqueceuSenha';
import RedefinirSenha from '../pages/RedefinirSenha/redefinirSenha';
import { PrivateRoute } from './privateRoute';

function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/politicaPrivacidade' element={<PoliticaPrivacidade />} />
                <Route path='/esqueceuSenha' element={<EsqueceuSenha />} />
                <Route path='/redefinirSenha' element={<RedefinirSenha />} />

                <Route path="/cliente/comercios" element={<PrivateRoute requiredProfile="cliente"><Comercios /></PrivateRoute>} />
                <Route path='/cliente/escolher-servico' element={<PrivateRoute requiredProfile="cliente"><EscolherServico /></PrivateRoute>} />
                <Route path='/cliente/agendar-horario' element={<PrivateRoute requiredProfile="cliente"><AgendarHorario /></PrivateRoute>} />
                <Route path='/cliente/agendamento' element={<PrivateRoute requiredProfile="cliente"><AgendamentosCliente /></PrivateRoute>} />
                <Route path='/cliente/dados' element={<PrivateRoute requiredProfile="cliente"><DadosCliente /></PrivateRoute>} />
                <Route path='/cliente/perfil' element={<PrivateRoute requiredProfile="cliente"><PerfilCliente /></PrivateRoute>} />
                <Route path='/cliente/fazer-avaliacao' element={<PrivateRoute requiredProfile="cliente"><FazerAvaliacao /></PrivateRoute>} />
                <Route path='/cliente/alterar-dados' element={<PrivateRoute requiredProfile="cliente"><AlterarDadosCliente /></PrivateRoute>} />

                <Route path='/prestador/escolha' element={<PrivateRoute requiredProfile="prestador"><EscolhaPrestador /></PrivateRoute>} />
                <Route path='/prestador/assinatura' element={<PrivateRoute requiredProfile="prestador"><AssinaturaPlano /></PrivateRoute>} />
                <Route path='/prestador/criar-negocio' element={<PrivateRoute requiredProfile="prestador"><InicioParceiro /></PrivateRoute>} />
                <Route path='/parceiro/perfil' element={<PrivateRoute requiredProfile="prestador"><PerfilParceiro /></PrivateRoute>} />
                <Route path='/parceiro/agendamento' element={<PrivateRoute requiredProfile="prestador"><AgendamentoParceiro /></PrivateRoute>} />
                <Route path='/parceiro/relatorio' element={<PrivateRoute requiredProfile="prestador"><RelatorioParceiro /></PrivateRoute>} />
                <Route path='/parceiro/servicos' element={<PrivateRoute requiredProfile="prestador"><ServicosParceiro /></PrivateRoute>} />
                <Route path='/parceiro/dados' element={<PrivateRoute requiredProfile="prestador"><DadosParceiro /></PrivateRoute>} />
                <Route path='/parceiro/alterar-dados' element={<PrivateRoute requiredProfile="prestador"><AlterarDadosParceiro /></PrivateRoute>} />
                <Route path='/parceiro/avaliações' element={<PrivateRoute requiredProfile="prestador"><AvaliacoesParceiro /></PrivateRoute>} />
                <Route path='/parceiro/gerenciar-negocio' element={<PrivateRoute requiredProfile="prestador"><GerenciarNegocio /></PrivateRoute>} />
                <Route path='/parceiro/horarioDeTrabalhoParceiro' element={<PrivateRoute requiredProfile="prestador"><HorarioDeTrabalhoParceiro /></PrivateRoute>} />
                <Route path='/parceiro/gerenciar-perfil' element={<PrivateRoute requiredProfile="prestador"><GerenciarPerfilParceiro /></PrivateRoute>} />
                <Route path='/parceiro/usuarios-bloqueados' element={<PrivateRoute requiredProfile="prestador"><UsuariosBloqueados /></PrivateRoute>} />

                <Route path="/admin" element={<PrivateRoute requiredProfile="admin"><ADMNavBar /></PrivateRoute>}>
                    <Route index element={<PrivateRoute requiredProfile="admin"><PainelADM /></PrivateRoute>} />
                    <Route path="painelAdm" element={<PrivateRoute requiredProfile="admin"><PainelADM /></PrivateRoute>} />
                    <Route path="clienteAdm" element={<PrivateRoute requiredProfile="admin"><ClienteADM /></PrivateRoute>} />
                    <Route path="parceiroAdm" element={<PrivateRoute requiredProfile="admin"><ParceiroADM /></PrivateRoute>} />
                    <Route path="servicosAdm" element={<PrivateRoute requiredProfile="admin"><ServicosADM /></PrivateRoute>} />
                    <Route path="configuracaoAdm" element={<PrivateRoute requiredProfile="admin"><ConfiguracaoADM /></PrivateRoute>} />
                </Route>

                
            </Routes>
        </Router>
    )
}

export default AppRoutes;