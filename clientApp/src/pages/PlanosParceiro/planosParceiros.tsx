import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoAgendei from "../../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário
import { 
  FiCheck, 
  FiUsers, 
  FiCalendar, 
  FiBarChart2, 
  FiTrendingUp,
  FiStar,
  FiZap
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

interface Plano {
  id: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  destaque: boolean;
  totalParceiros: number;
  parceiroExtra: number;
  recursos: string[];
  badge?: string;
  cor: string;
}

export default function Planos() {
  const navigate = useNavigate();
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  const [periodoAnual, setPeriodoAnual] = useState(false);

  const planos: Plano[] = [
    {
      id: "basico",
      nome: "Básico",
      preco: periodoAnual ? 29.90 : 39.90,
      precoOriginal: periodoAnual ? 39.90 : undefined,
      destaque: false,
      totalParceiros: 2,
      parceiroExtra: 1,
      cor: "from-blue-500 to-blue-600",
      recursos: [
        "Você + 1 parceiro",
        "Agendamentos ilimitados",
        "Relatórios de desempenho",
        "Notificações por email",
        "Gestão de serviços"
      ]
    },
    {
      id: "profissional",
      nome: "Profissional",
      preco: periodoAnual ? 59.90 : 79.90,
      precoOriginal: periodoAnual ? 79.90 : undefined,
      destaque: true,
      totalParceiros: 4,
      parceiroExtra: 3,
      badge: "Mais Popular",
      cor: "from-purple-600 to-purple-500",
      recursos: [
        "Você + 3 parceiros",
        "Agendamentos ilimitados",
        "Relatórios de desempenho",
        "Notificações por email",
        "Gestão de serviços"
      ]
    },
    {
      id: "empresarial",
      nome: "Empresarial",
      preco: periodoAnual ? 99.90 : 129.90,
      precoOriginal: periodoAnual ? 129.90 : undefined,
      destaque: false,
      totalParceiros: 6,
      parceiroExtra: 5,
      cor: "from-amber-500 to-orange-500",
      recursos: [
        "Você + 5 parceiros",
        "Agendamentos ilimitados",
        "Relatórios de desempenho",
        "Notificações por email",
        "Gestão de serviços"
      ]
    }
  ];

  const handleEscolherPlano = (planoId: string) => {
    setPlanoSelecionado(planoId);
    // Aqui você pode redirecionar para o checkout ou próxima etapa
    // navigate(`/checkout?plano=${planoId}&periodo=${periodoAnual ? 'anual' : 'mensal'}`);
    console.log("Plano selecionado:", planoId, "Período:", periodoAnual ? "anual" : "mensal");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src={LogoAgendei} 
            alt="Agendei" 
            className="h-10 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <button 
            onClick={() => navigate("/login")}
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors cursor-pointer"
          >
            Já tenho conta
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
          <HiSparkles />
          <span className="text-sm font-semibold">Escolha o plano ideal para seu negócio</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Planos que crescem com você
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Comece a gerenciar seus agendamentos de forma profissional e expanda sua equipe conforme seu negócio cresce.
        </p>

        {/* Toggle Período */}
        <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setPeriodoAnual(false)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              !periodoAnual 
                ? "bg-purple-600 text-white shadow" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriodoAnual(true)}
            className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
              periodoAnual 
                ? "bg-purple-600 text-white shadow" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Anual
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              -25%
            </span>
          </button>
        </div>
      </section>

      {/* Cards de Planos */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
                plano.destaque ? "ring-4 ring-purple-500 ring-opacity-50" : ""
              }`}
            >
              {/* Badge */}
              {plano.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FiStar size={14} />
                    {plano.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header do Card */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plano.cor} flex items-center justify-center shadow-lg`}>
                    <FiUsers className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plano.nome}
                  </h3>
                  
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plano.preco.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-500">/{periodoAnual ? 'ano' : 'mês'}</span>
                  </div>
                  
                  {plano.precoOriginal && (
                    <p className="text-sm text-gray-500">
                      De <span className="line-through">R$ {plano.precoOriginal.toFixed(2).replace('.', ',')}</span> por apenas
                    </p>
                  )}
                  
                  <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <FiUsers className="text-purple-600" size={16} />
                    <span className="text-sm font-semibold text-gray-700">
                      {plano.totalParceiros} pessoas total
                    </span>
                  </div>
                </div>

                {/* Recursos */}
                <ul className="space-y-3 mb-8">
                  {plano.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <FiCheck className="text-green-600 text-sm" />
                      </div>
                      <span className="text-gray-700 text-sm">{recurso}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão */}
                <button
                  onClick={() => handleEscolherPlano(plano.id)}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all cursor-pointer shadow-md hover:shadow-lg ${
                    plano.destaque
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:brightness-110"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Escolher {plano.nome}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Recursos Adicionais */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Todos os planos incluem
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <FiCalendar className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Agendamento Online</h3>
              <p className="text-sm text-gray-600">
                Sistema completo de agendamentos para seus clientes
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FiBarChart2 className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Relatórios</h3>
              <p className="text-sm text-gray-600">
                Acompanhe o desempenho do seu negócio em tempo real
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <FiTrendingUp className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sem Limite</h3>
              <p className="text-sm text-gray-600">
                Agendamentos ilimitados em todos os planos
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
                <FiZap className="text-amber-600 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Atualizações</h3>
              <p className="text-sm text-gray-600">
                Receba novos recursos gratuitamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                Posso mudar de plano depois?
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas imediatamente.
              </p>
            </details>


            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                Posso cancelar a qualquer momento?
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Sim! Não há contratos ou multas por cancelamento. Você pode cancelar sua assinatura a qualquer momento.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                O que acontece se eu precisar de mais parceiros?
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600">
                Você pode fazer upgrade para um plano superior ou entrar em contato para soluções personalizadas para grandes equipes.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já confiam no Agendei para gerenciar seus agendamentos.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Escolher meu plano
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Agendei. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}