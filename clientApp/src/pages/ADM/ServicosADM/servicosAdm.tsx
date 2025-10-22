import ADMNavBar from "../ADMNavBar";
import { useState } from "react";

// Servicos para cada prestador (mock, troque por API depois)
const PRESTADORES = [
  {
    id: 1, avatar: "AR", nome: "Ana Ribeiro", especialidade: "Cabeleireira", servicos: [
      { nome: "Corte feminino", preco: "R$ 50,00", duracao: "40min", id: 201 },
      { nome: "Coloração", preco: "R$ 120,00", duracao: "1h", id: 202 },
      { nome: "Escova", preco: "R$ 40,00", duracao: "30min", id: 203 }
    ]
  },
  {
    id: 2, avatar: "JS", nome: "João Sousa", especialidade: "Barbeiro", servicos: [
      { nome: "Corte masculino", preco: "R$ 30,00", duracao: "20min", id: 210 },
      { nome: "Barba e bigode", preco: "R$ 25,00", duracao: "15min", id: 211 }
    ]
  },
  {
    id: 3, avatar: "MC", nome: "Maria Clara", especialidade: "Manicure", servicos: [
      { nome: "Manicure tradicional", preco: "R$ 28,00", duracao: "40min", id: 220 },
      { nome: "Pedicure", preco: "R$ 38,00", duracao: "50min", id: 221 }
    ]
  }
];

export default function ServicosAdm() {
  const [expandido, setExpandido] = useState<number | null>(null);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Altere serviços</h2>
      <ul className="flex flex-col gap-6">
        {PRESTADORES.map(pres => (
          <li key={pres.id} className="bg-gray-50 rounded-xl shadow px-6 py-5">
            <button
              className="flex items-center w-full group cursor-pointer"
              onClick={() => setExpandido(expandido === pres.id ? null : pres.id)}
            >
              <span className="avatar bg-purple-400 text-white w-10 h-10 rounded-full font-bold flex items-center justify-center mr-3 text-lg select-none">{pres.avatar}</span>
              <div className="flex-1 text-left">
                <span className="font-bold text-base">{pres.nome}</span>
                <span className="text-gray-500 text-xs ml-3">Especialidade: {pres.especialidade}</span>
              </div>
              <span className={`ml-2 transition text-lg text-purple-400 ${expandido === pres.id ? "rotate-90" : ""}`}>
                ▶
              </span>
            </button>
            {expandido === pres.id && (
              <ul className="flex flex-col gap-2 mt-5">
                {pres.servicos.map(serv => (
                  <li key={serv.id} className="service-item flex justify-between items-center bg-white rounded-lg shadow px-5 py-3">
                    <div>
                      <span className="font-bold text-base">{serv.nome}</span>
                      <span className="text-gray-400 text-xs ml-2 block sm:inline">Duração: {serv.duracao}</span>
                    </div>
                    <span className="text-purple-600 font-bold">{serv.preco}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}