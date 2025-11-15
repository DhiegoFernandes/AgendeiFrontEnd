import { useState } from "react";
import { HiX } from "react-icons/hi";

export type TipoPlano = "BASICO" | "INTERMEDIARIO" | "AVANCADO";

interface Plano {
  tipo: TipoPlano;
  nome: string;
  valor: string;
  descricao: string;
  features: string[];
}

const PLANOS: Plano[] = [
  {
    tipo: "BASICO",
    nome: "Básico",
    valor: "R$ 49,90",
    descricao: "Ideal para começar",
    features: [
      "Até 2 prestadores (incluindo o dono)",
      "1 convite disponível"
    ]
  },
  {
    tipo: "INTERMEDIARIO",
    nome: "Intermediário",
    valor: "R$ 79,90",
    descricao: "Para negócios em crescimento",
    features: [
      "Até 4 prestadores (incluindo o dono)",
      "3 convites disponíveis"
    ]
  },
  {
    tipo: "AVANCADO",
    nome: "Avançado",
    valor: "R$ 119,90",
    descricao: "Máxima performance",
    features: [
      "Até 6 prestadores (incluindo o dono)",
      "5 convites disponíveis"
    ]
  }
];

interface ModalPlanosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelecionarPlano: (plano: TipoPlano) => void;
  planoAtual?: TipoPlano;
  carregando?: boolean;
}

export default function ModalPlanos({
  isOpen,
  onClose,
  onSelecionarPlano,
  planoAtual,
  carregando = false
}: ModalPlanosProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState<TipoPlano | null>(null);

  if (!isOpen) return null;

  const handleConfirmar = () => {
    if (planoSelecionado) {
      onSelecionarPlano(planoSelecionado);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-purple-700">Escolher Plano</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer p-1"
            disabled={carregando}
          >
            <HiX size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Selecione o plano que melhor se adequa ao seu negócio
          </p>

          {/* Cards de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {PLANOS.map((plano) => {
              const isSelecionado = planoSelecionado === plano.tipo;
              const isAtual = planoAtual === plano.tipo;

              return (
                <div
                  key={plano.tipo}
                  onClick={() => !carregando && setPlanoSelecionado(plano.tipo)}
                  className={`
                    relative border-2 rounded-xl p-6 cursor-pointer transition-all
                    ${isSelecionado 
                      ? "border-purple-600 bg-purple-50 shadow-lg scale-105" 
                      : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                    }
                    ${carregando ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isAtual && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Atual
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">{plano.nome}</h3>
                    <p className="text-sm text-gray-500 mb-3">{plano.descricao}</p>
                    <div className="text-3xl font-bold text-purple-600">{plano.valor}</div>
                    <p className="text-xs text-gray-400 mt-1">por mês</p>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plano.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelecionado && (
                    <div className="mt-4 text-center">
                      <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                        Selecionado
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botões */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!planoSelecionado || carregando || planoSelecionado === planoAtual}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Atualizando..." : "Confirmar Mudança"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

