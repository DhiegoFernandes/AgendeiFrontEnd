import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHorizontal from "../../assets/AgendeiHorizontal.png"; // Ajuste o caminho conforme necessário

export default function PoliticaPrivacidade() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  
  // Verificar se o usuário está logado e qual o tipo
  useEffect(() => {
    // Aqui você faria a verificação real do token e tipo de usuário
    const checkUserAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Verificar o tipo de usuário baseado em alguma informação armazenada
        const type = localStorage.getItem("userType"); // "cliente" ou "parceiro"
        setUserType(type);
      } else {
        setUserType(null);
      }
    };
    
    checkUserAuth();
  }, []);

  // Função para navegar para a página de perfil baseada no tipo de usuário
  const handleProfileClick = () => {
    if (!userType) {
      navigate("/"); // Não está logado, vai para home
    } else if (userType === "cliente") {
      navigate("/cliente/perfil");
    } else if (userType === "parceiro") {
      navigate("/parceiro/perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex flex-col md:flex-row justify-between items-center h-22">
          <div className="mb-4 md:mb-0">
            <a href="/" className="flex items-center">
              <img src={LogoHorizontal} alt="Logo Agendei" className="h-17" />
            </a>
          </div>
          <nav className="flex space-x-6 text-gray-700">
            <button 
              onClick={handleProfileClick}
              className="font-medium hover:text-purple-600 transition-colors"
            >
              Perfil
            </button>
            <a 
              href="/" 
              className="font-medium hover:text-purple-600 transition-colors"
            >
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 mt-5">
          Política de Privacidade - Agendei
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Última atualização: Janeiro de 2025
        </p>

        {/* Sections */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              1. INTRODUÇÃO
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                A presente Política de Privacidade descreve como o Agendei coleta, utiliza, armazena e protege as informações pessoais dos usuários da nossa plataforma de agendamentos de serviços estéticos.
              </p>
              <p>
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis à proteção de dados pessoais no Brasil.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              2. RESPONSÁVEL PELO TRATAMENTO DOS DADOS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Agendei</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>E-mail:</strong> contato@agendei.com.br</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              3. DADOS PESSOAIS COLETADOS
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  3.1 Dados Coletados de Clientes
                </h3>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Dados de Identificação:</strong> Nome completo, e-mail, telefone</li>
                  <li><strong>Dados de Localização:</strong> CEP, endereço completo</li>
                  <li><strong>Dados de Uso:</strong> Histórico de agendamentos, avaliações realizadas</li>
                  <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador (coletados automaticamente)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  3.2 Dados Coletados de Prestadores
                </h3>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Dados de Identificação:</strong> Nome completo, e-mail, telefone</li>
                  <li><strong>Dados do Negócio:</strong> Nome do estabelecimento, CEP, endereço, categoria</li>
                  <li><strong>Dados de Serviços:</strong> Descrição, preços, duração dos serviços oferecidos</li>
                  <li><strong>Dados de Agenda:</strong> Horários disponíveis, agendamentos realizados</li>
                  <li><strong>Dados de Avaliação:</strong> Avaliações recebidas de clientes</li>
                  <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador (coletados automaticamente)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              4. FINALIDADES DO TRATAMENTO
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  4.1 Finalidades Principais
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Prestação do Serviço:</strong> Conectar clientes e prestadores de serviços</li>
                  <li><strong>Agendamentos:</strong> Facilitar o agendamento e gestão de horários</li>
                  <li><strong>Comunicação:</strong> Enviar notificações sobre agendamentos</li>
                  <li><strong>Avaliações:</strong> Permitir que usuários avaliem serviços prestados</li>
                  <li><strong>Funcionamento da Plataforma:</strong> Garantir o correto funcionamento do sistema</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  4.2 Finalidades Secundárias
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Análise de Dados:</strong> Estatísticas agregadas e anonimizadas para melhorias</li>
                  <li><strong>Segurança:</strong> Prevenir uso inadequado da plataforma</li>
                  <li><strong>Suporte:</strong> Atender dúvidas e solicitações dos usuários</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              5. BASE LEGAL PARA O TRATAMENTO
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  5.1 Execução de Contrato
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Dados necessários para prestação do serviço de agendamentos</li>
                  <li>Dados para cumprimento de obrigações contratuais entre clientes e prestadores</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  5.2 Legítimo Interesse
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Análise de uso da plataforma para melhorias</li>
                  <li>Prevenção de uso inadequado da plataforma</li>
                  <li>Desenvolvimento de novas funcionalidades</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  5.3 Cumprimento de Obrigação Legal
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Dados para cumprimento de obrigações fiscais e contábeis</li>
                  <li>Dados para atender solicitações de autoridades competentes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              6. COMPARTILHAMENTO DE DADOS
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  6.1 Compartilhamento com Prestadores
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Dados do Cliente:</strong> Nome, telefone, e-mail (apenas para agendamentos específicos)</li>
                  <li><strong>Finalidade:</strong> Permitir que prestadores entrem em contato e prestem serviços</li>
                  <li><strong>Limitação:</strong> Apenas dados necessários para o agendamento específico</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  6.2 Compartilhamento com Serviços Externos
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>ViaCEP:</strong> CEP para busca automática de endereços</li>
                  <li><strong>Google Maps:</strong> Endereços para localização e cálculo de rotas</li>
                  <li><strong>Google Calendar:</strong> Horários de agendamentos (quando implementado)</li>
                  <li><strong>EmailJS:</strong> Dados para envio de e-mails (quando implementado)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  6.3 Compartilhamento com Autoridades
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Para investigação de atividades ilegais</li>
                  <li>Para proteção de direitos e segurança</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              7. ARMAZENAMENTO E SEGURANÇA
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  7.1 Período de Armazenamento
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Dados de Conta:</strong> Mantidos enquanto a conta estiver ativa</li>
                  <li><strong>Dados de Agendamentos:</strong> Mantidos por 3 anos para fins contábeis</li>
                  <li><strong>Dados de Avaliações:</strong> Mantidos indefinidamente (podem ser anonimizados)</li>
                  <li><strong>Logs de Acesso:</strong> Mantidos por 6 meses</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  7.2 Medidas de Segurança
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Senhas:</strong> Senhas são protegidas com hash criptográfico</li>
                  <li><strong>Acesso Restrito:</strong> Apenas pessoal autorizado tem acesso aos dados</li>
                  <li><strong>Backup:</strong> Dados são copiados regularmente</li>
                  <li><strong>Atualizações:</strong> Sistemas mantidos atualizados</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  7.3 Localização dos Dados
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Dados são armazenados em servidores no Brasil</li>
                  <li>Backup pode ser realizado em servidores internacionais com proteção adequada</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              8. DIREITOS DOS TITULARES
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  8.1 Direitos Garantidos pela LGPD
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Confirmação e Acesso:</strong> Saber se seus dados são tratados e acessá-los</li>
                  <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Remover dados desnecessários</li>
                  <li><strong>Portabilidade:</strong> Transferir dados para outro prestador de serviço</li>
                  <li><strong>Eliminação:</strong> Excluir dados tratados com consentimento</li>
                  <li><strong>Informação:</strong> Saber sobre compartilhamento de dados</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  8.2 Como Exercer os Direitos
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>E-mail:</strong> contato@agendei.com.br</li>
                  <li><strong>Prazo de Resposta:</strong> Até 15 dias úteis</li>
                  <li><strong>Identificação:</strong> Necessária para verificar identidade</li>
                  <li><strong>Gratuidade:</strong> Exercício de direitos é gratuito</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              9. MENORES DE IDADE
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  9.1 Proteção de Menores
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Não coletamos intencionalmente dados de menores de 18 anos</li>
                  <li>Menores devem ter autorização de responsável legal</li>
                  <li>Responsáveis podem solicitar exclusão de dados de menores</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  9.2 Responsabilidade
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Pais/responsáveis são responsáveis por menores em sua conta</li>
                  <li>Devem supervisionar uso da plataforma por menores</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              10. ALTERAÇÕES NA POLÍTICA
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  10.1 Modificações
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Política pode ser atualizada periodicamente</li>
                  <li>Alterações significativas serão comunicadas</li>
                  <li>Versão atual sempre disponível na plataforma</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  10.2 Notificação de Mudanças
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>E-mail:</strong> Para mudanças significativas</li>
                  <li><strong>Plataforma:</strong> Banner ou popup informativo</li>
                  <li><strong>Prazo:</strong> 30 dias de antecedência para mudanças importantes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              11. RESPONSABILIDADE E LIMITAÇÕES
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  11.1 Responsabilidade do Agendei
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Implementamos medidas de segurança adequadas para o nível de dados tratados</li>
                  <li>Monitoramos o funcionamento da plataforma</li>
                  <li>Notificamos sobre problemas de segurança quando aplicável</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  11.2 Limitações
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Não somos responsáveis por ações de terceiros</li>
                  <li>Usuários são responsáveis por manter senhas seguras</li>
                  <li>Não garantimos disponibilidade absoluta da plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              12. VIOLAÇÃO DE DADOS
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  12.1 O que é uma Violação
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Acesso não autorizado a dados pessoais</li>
                  <li>Alteração, destruição ou perda de dados</li>
                  <li>Divulgação não autorizada de dados</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  12.2 Nossa Resposta
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Investigação imediata do incidente</li>
                  <li>Notificação às autoridades competentes (quando necessário)</li>
                  <li>Comunicação aos titulares afetados (quando aplicável)</li>
                  <li>Implementação de medidas corretivas</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              13. CONTATO E DÚVIDAS
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  13.1 Contato Principal
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>E-mail:</strong> contato@agendei.com.br</li>
                  <li><strong>Horário:</strong> Segunda a sexta, 9h às 18h</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  13.2 Outros Contatos
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Suporte:</strong> contato@agendei.com.br</li>
                  <li><strong>Reclamações:</strong> contato@agendei.com.br</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              14. LEGISLAÇÃO APLICÁVEL
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  14.1 Leis Aplicáveis
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</li>
                  <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                  <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
                  <li>Demais legislações aplicáveis</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  14.2 Autoridade de Controle
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Autoridade Nacional de Proteção de Dados (ANPD)</li>
                  <li>Procon (para questões consumeristas)</li>
                  <li>Demais autoridades competentes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              15. DISPOSIÇÕES FINAIS
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  15.1 Interpretação
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Esta política deve ser interpretada em conjunto com os Termos de Uso</li>
                  <li>Em caso de conflito, prevalece a legislação aplicável</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  15.2 Vigência
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Política entra em vigor na data de publicação</li>
                  <li>Versões anteriores ficam arquivadas para consulta</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  15.3 Idioma
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Política redigida em português brasileiro</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="space-y-4 text-gray-700">
              <p className="font-semibold text-lg text-purple-800">
                Ao utilizar a plataforma Agendei, você declara ter lido, compreendido e aceito integralmente esta Política de Privacidade.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p><strong>Data de vigência:</strong> Janeiro de 2025</p>
                <p><strong>Versão:</strong> 1.0</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto max-w-4xl px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Agendei. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}