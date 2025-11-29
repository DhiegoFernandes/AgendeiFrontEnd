import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { FaCreditCard, FaQrcode, FaBarcode, FaSpinner } from "react-icons/fa";

type TipoPlano = "BASICO" | "INTERMEDIARIO" | "AVANCADO";
type MetodoPagamento = "PIX" | "CARTAO" | "BOLETO";

interface Plano {
  tipo: TipoPlano;
  nome: string;
  valorMensal: number;
  valorAnual: number;
  descricao: string;
  features: string[];
}

const PLANOS: Plano[] = [
  {
    tipo: "BASICO",
    nome: "Básico",
    valorMensal: 49.90,
    valorAnual: 49.90 * 0.82,
    descricao: "Ideal para começar",
    features: [
      "Até 2 prestadores (incluindo o dono)",
      "1 convite disponível",
      "Gestão completa de agendamentos",
      "Relatórios básicos"
    ]
  },
  {
    tipo: "INTERMEDIARIO",
    nome: "Intermediário",
    valorMensal: 79.90,
    valorAnual: 79.90 * 0.82,
    descricao: "Para negócios em crescimento",
    features: [
      "Até 4 prestadores (incluindo o dono)",
      "3 convites disponíveis",
      "Gestão completa de agendamentos",
      "Relatórios avançados",
      "Suporte prioritário"
    ]
  },
  {
    tipo: "AVANCADO",
    nome: "Avançado",
    valorMensal: 119.90,
    valorAnual: 119.90 * 0.82,
    descricao: "Máxima performance",
    features: [
      "Até 6 prestadores (incluindo o dono)",
      "5 convites disponíveis",
      "Gestão completa de agendamentos",
      "Relatórios completos",
      "Suporte prioritário 24/7",
      "API personalizada"
    ]
  }
];

export default function AssinaturaPlano() {
  const navigate = useNavigate();
  const [planoSelecionado, setPlanoSelecionado] = useState<TipoPlano>("INTERMEDIARIO");
  const [periodoAnual, setPeriodoAnual] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("PIX");
  const [processando, setProcessando] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const plano = PLANOS.find(p => p.tipo === planoSelecionado)!;
  const valorAtual = periodoAnual ? plano.valorAnual : plano.valorMensal;

  function handleConfirmarAssinatura() {
    setProcessando(true);
    
    // Simular processamento do pagamento (mock)
    setTimeout(() => {
      setProcessando(false);
      setMostrarConfirmacao(true);
      
      // Após 2 segundos, redirecionar para criar negócio
      setTimeout(() => {
        navigate("/prestador/criar-negocio");
      }, 2000);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-gray-600">
            Selecione o plano ideal para o seu negócio
          </p>
        </div>

        {/* Toggle Período */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setPeriodoAnual(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${
                !periodoAnual 
                  ? "bg-purple-600 text-white shadow" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriodoAnual(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                periodoAnual 
                  ? "bg-purple-600 text-white shadow" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Anual
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                -18%
              </span>
            </button>
          </div>
        </div>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {PLANOS.map((p) => {
            const isSelecionado = planoSelecionado === p.tipo;
            return (
              <div
                key={p.tipo}
                onClick={() => setPlanoSelecionado(p.tipo)}
                className={`
                  relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all
                  ${isSelecionado 
                    ? "border-2 border-purple-500 scale-105 shadow-xl" 
                    : "border-2 border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                {isSelecionado && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Selecionado
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-purple-700 mb-2">{p.nome}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.descricao}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-extrabold text-purple-600">
                      R$ {(periodoAnual ? p.valorAnual : p.valorMensal).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-500 text-sm block mt-1">por mês</span>
                    {periodoAnual && (
                      <p className="text-xs text-gray-400 mt-1">
                        <span className="line-through">R$ {p.valorMensal.toFixed(2).replace('.', ',')}</span> /mês
                      </p>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {p.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <HiCheck className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Método de Pagamento */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Método de Pagamento</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* PIX */}
            <div
              onClick={() => setMetodoPagamento("PIX")}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all
                ${metodoPagamento === "PIX"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FaQrcode className={`text-2xl ${metodoPagamento === "PIX" ? "text-purple-600" : "text-gray-400"}`} />
                <div>
                  <div className="font-bold text-gray-800">PIX</div>
                  <div className="text-xs text-gray-500">Aprovação imediata</div>
                </div>
                {metodoPagamento === "PIX" && (
                  <HiCheck className="text-purple-600 ml-auto" />
                )}
              </div>
            </div>

            {/* Cartão */}
            <div
              onClick={() => setMetodoPagamento("CARTAO")}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all
                ${metodoPagamento === "CARTAO"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FaCreditCard className={`text-2xl ${metodoPagamento === "CARTAO" ? "text-purple-600" : "text-gray-400"}`} />
                <div>
                  <div className="font-bold text-gray-800">Cartão</div>
                  <div className="text-xs text-gray-500">Crédito ou Débito</div>
                </div>
                {metodoPagamento === "CARTAO" && (
                  <HiCheck className="text-purple-600 ml-auto" />
                )}
              </div>
            </div>

            {/* Boleto */}
            <div
              onClick={() => setMetodoPagamento("BOLETO")}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all
                ${metodoPagamento === "BOLETO"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FaBarcode className={`text-2xl ${metodoPagamento === "BOLETO" ? "text-purple-600" : "text-gray-400"}`} />
                <div>
                  <div className="font-bold text-gray-800">Boleto</div>
                  <div className="text-xs text-gray-500">Aprovação em até 3 dias</div>
                </div>
                {metodoPagamento === "BOLETO" && (
                  <HiCheck className="text-purple-600 ml-auto" />
                )}
              </div>
            </div>
          </div>

          {/* Formulário de Pagamento (Mock) */}
          {metodoPagamento === "CARTAO" && (
            <div className="border-t pt-6 mt-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>
          )}

          {metodoPagamento === "PIX" && (
            <div className="border-t pt-6 mt-6 bg-purple-50 rounded-xl p-6 text-center">
              <FaQrcode className="text-4xl text-purple-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                QR Code será gerado após confirmação
              </p>
              <p className="text-sm text-gray-500">
                Aprovação imediata após pagamento
              </p>
            </div>
          )}

          {metodoPagamento === "BOLETO" && (
            <div className="border-t pt-6 mt-6 bg-purple-50 rounded-xl p-6 text-center">
              <FaBarcode className="text-4xl text-purple-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                Boleto será gerado após confirmação
              </p>
              <p className="text-sm text-gray-500">
                Aprovação em até 3 dias úteis após pagamento
              </p>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo da Assinatura</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plano selecionado:</span>
              <span className="font-bold text-gray-800">{plano.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valor mensal:</span>
              <span className="font-bold text-gray-800">R$ {valorAtual.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Método de pagamento:</span>
              <span className="font-bold text-gray-800">{metodoPagamento}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-extrabold text-purple-600">R$ {valorAtual.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => navigate("/prestador/escolha")}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition cursor-pointer"
          >
            Voltar
          </button>
          <button
            onClick={handleConfirmarAssinatura}
            disabled={processando}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:brightness-110 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {processando ? (
              <>
                <FaSpinner className="animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Assinatura"
            )}
          </button>
        </div>

        {/* Modal de Confirmação */}
        {mostrarConfirmacao && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheck className="text-green-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Assinatura Confirmada!
              </h2>
              <p className="text-gray-600 mb-6">
                Seu plano {plano.nome} foi ativado com sucesso. Agora você pode criar seu negócio!
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <FaSpinner className="animate-spin" />
                <span className="text-sm">Redirecionando...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

