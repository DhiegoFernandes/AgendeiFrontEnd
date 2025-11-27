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

// import { PrivateRoute } from './privateRoute';

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

                <Route path="/cliente/comercios" element={<Comercios />} />
                <Route path='/cliente/escolher-servico' element={<EscolherServico />} />
                <Route path='/cliente/agendar-horario' element={<AgendarHorario />} />
                <Route path='/cliente/agendamento' element={<AgendamentosCliente />} />
                <Route path='/cliente/dados' element={<DadosCliente />} />
                <Route path='/cliente/perfil' element={<PerfilCliente />} />
                <Route path='/cliente/fazer-avaliacao' element={<FazerAvaliacao />} />
                <Route path='/cliente/alterar-dados' element={<AlterarDadosCliente />} />

                <Route path='/prestador/escolha' element={<EscolhaPrestador />} />
                <Route path='/prestador/assinatura' element={<AssinaturaPlano />} />
                <Route path='/prestador/criar-negocio' element={<InicioParceiro />} />
                <Route path='/parceiro/perfil' element={<PerfilParceiro />} />
                <Route path='/parceiro/agendamento' element={<AgendamentoParceiro />} />
                <Route path='/parceiro/relatorio' element={<RelatorioParceiro />} />
                <Route path='/parceiro/servicos' element={<ServicosParceiro />} />
                <Route path='/parceiro/dados' element={<DadosParceiro />} />
                <Route path='/parceiro/alterar-dados' element={<AlterarDadosParceiro />} />
                <Route path='/parceiro/avaliações' element={<AvaliacoesParceiro />} />
                <Route path='/parceiro/gerenciar-negocio' element={<GerenciarNegocio />} />
                <Route path='/parceiro/horarioDeTrabalhoParceiro' element={<HorarioDeTrabalhoParceiro />} />
                <Route path='/parceiro/gerenciar-perfil' element={<GerenciarPerfilParceiro />} />
                <Route path='/parceiro/usuarios-bloqueados' element={<UsuariosBloqueados />} />

                <Route path="/admin" element={<ADMNavBar />}>
                    <Route index element={<PainelADM />} />
                    <Route path="painelAdm" element={<PainelADM />} />
                    <Route path="clienteAdm" element={<ClienteADM />} />
                    <Route path="parceiroAdm" element={<ParceiroADM />} />
                    <Route path="servicosAdm" element={<ServicosADM />} />
                    <Route path="configuracaoAdm" element={<ConfiguracaoADM />} />
                </Route>

                
            </Routes>
        </Router>
    )
}

export default AppRoutes;