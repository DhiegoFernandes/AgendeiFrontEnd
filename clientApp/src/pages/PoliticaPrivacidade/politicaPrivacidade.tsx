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
          Política de Privacidade
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Última atualização: 15 de Agosto de 2025
        </p>

        {/* Sections */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              1. Introdução
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Bem-vindo(a) à Política de Privacidade do Agendei. Nós valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais.
              </p>
              <p>
                Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso aplicativo, site e serviços relacionados ("Serviços").
              </p>
              <p>
                Ao utilizar nossos Serviços, você concorda com as práticas descritas nesta Política de Privacidade. Por favor, leia atentamente.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              2. Informações que Coletamos
            </h2>
            <div className="space-y-5 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  2.1 Informações Fornecidas por Você
                </h3>
                <p>Coletamos informações que você nos fornece diretamente, incluindo:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Dados de cadastro (nome, e-mail, telefone, endereço)</li>
                  <li>Dados de perfil e preferências</li>
                  <li>Informações de agendamento e histórico de serviços</li>
                  <li>Comunicações com nossa equipe de suporte</li>
                  <li>Avaliações e comentários sobre prestadores de serviços</li>
                  <li>Informações de pagamento (processadas de forma segura por nossos parceiros de pagamento)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  2.2 Informações Coletadas Automaticamente
                </h3>
                <p>Quando você utiliza nossos Serviços, podemos coletar automaticamente:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Dados de dispositivo (modelo, sistema operacional, identificadores únicos)</li>
                  <li>Dados de localização (com sua permissão)</li>
                  <li>Dados de uso (páginas visitadas, serviços visualizados, tempo gasto)</li>
                  <li>Informações de log e diagnóstico</li>
                  <li>Cookies e tecnologias similares para melhorar sua experiência</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              3. Como Usamos Suas Informações
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Fornecer, manter e melhorar nossos Serviços</li>
                <li>Processar agendamentos e transações</li>
                <li>Conectar clientes e prestadores de serviços</li>
                <li>Enviar confirmações, lembretes e comunicações relacionadas ao serviço</li>
                <li>Personalizar sua experiência e oferecer recomendações</li>
                <li>Enviar informações sobre promoções e ofertas (você pode optar por não receber)</li>
                <li>Analisar tendências e comportamentos para melhorar nossos Serviços</li>
                <li>Detectar, investigar e prevenir atividades fraudulentas</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              4. Compartilhamento de Informações
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Podemos compartilhar suas informações com:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <span className="font-semibold text-purple-800">Prestadores de serviços:</span> Compartilhamos informações necessárias com os prestadores para viabilizar os agendamentos.
                </li>
                <li>
                  <span className="font-semibold text-purple-800">Parceiros de negócios:</span> Fornecedores que nos ajudam a operar nossos Serviços, como processadores de pagamento e serviços de hospedagem.
                </li>
                <li>
                  <span className="font-semibold text-purple-800">Quando exigido por lei:</span> Podemos divulgar suas informações para cumprir obrigações legais ou proteger direitos.
                </li>
                <li>
                  <span className="font-semibold text-purple-800">Com seu consentimento:</span> Em outros casos, solicitaremos sua permissão antes de compartilhar.
                </li>
              </ul>
              <p className="font-medium">Não vendemos suas informações pessoais a terceiros.</p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              5. Seus Direitos e Escolhas
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Você tem o direito de:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Acessar e baixar seus dados pessoais</li>
                <li>Corrigir informações imprecisas</li>
                <li>Solicitar a exclusão de seus dados (sujeito a obrigações legais)</li>
                <li>Optar por não receber comunicações de marketing</li>
                <li>Configurar preferências de cookies e rastreamento</li>
              </ul>
              <p>Para exercer esses direitos, acesse as configurações da sua conta ou entre em contato conosco.</p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              6. Segurança
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de suas informações.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              7. Retenção de Dados
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Mantemos suas informações pelo tempo necessário para fornecer nossos Serviços e cumprir obrigações legais. Quando não houver mais necessidade legítima de processamento, excluiremos ou anonimizaremos suas informações.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              8. Crianças
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nossos Serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de crianças. Se soubermos que coletamos informações de um menor, tomaremos medidas para excluí-las.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              9. Alterações nesta Política
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas por e-mail ou por meio de nossos Serviços. A data de "Última atualização" no topo indica quando a política foi revisada pela última vez.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-bold text-purple-800 pb-3 border-b border-gray-100 mb-4">
              10. Contato
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Se você tiver dúvidas ou preocupações, pode enviar email para{" "}
                <a href="mailto:agendei@suporte.com.br" className="text-purple-600 font-medium hover:underline">
                  agendei@suporte.com.br
                </a>
              </p>
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