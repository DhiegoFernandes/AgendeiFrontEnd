import { useState } from "react";
import { HiOutlineDocumentReport, HiOutlineArrowLeft, HiArrowNarrowUp, HiArrowNarrowDown } from "react-icons/hi";
import { FaMoneyBillTrendUp, FaChartSimple } from "react-icons/fa6";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

// Mock dos dados por período
const MOCK = {
  dia: {
    deltaServ: +14, deltaValor: +8, ticketDelta: null,
    totalServ: 24, valor: 1480, ticket: 61.67,
    services: [
      { name: 'Corte de Cabelo Social', qty: 10, value: 500 },
      { name: 'Barba', qty: 8, value: 400 },
      { name: 'Coloração', qty: 4, value: 380 },
      { name: 'Hidratação', qty: 2, value: 200 }
    ]
  },
  mes: {
    deltaServ: +12, deltaValor: +15, ticketDelta: +3,
    totalServ: 312, valor: 19850, ticket: 63.62,
    services: [
      { name: 'Corte de Cabelo Social', qty: 126, value: 6300 },
      { name: 'Barba', qty: 102, value: 5100 },
      { name: 'Coloração', qty: 54, value: 5130 },
      { name: 'Hidratação', qty: 30, value: 3320 }
    ]
  },
  ano: {
    deltaServ: +8, deltaValor: +10, ticketDelta: +2,
    totalServ: 3720, valor: 243600, ticket: 65.48,
    services: [
      { name: 'Corte de Cabelo Social', qty: 1540, value: 77000 },
      { name: 'Barba', qty: 1310, value: 65500 },
      { name: 'Coloração', qty: 540, value: 51300 },
      { name: 'Hidratação', qty: 330, value: 49600 }
    ]
  }
};

function ptBR(n: number, isMoney?: boolean) {
  if (isMoney) return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  return n.toLocaleString("pt-BR");
}

const TABS = [
  { key: "dia", label: "Dia" },
  { key: "mes", label: "Mês" },
  { key: "ano", label: "Ano" },
];

export default function RelatorioParceiro() {
  const [periodo, setPeriodo] = useState<"dia" | "mes" | "ano">("dia");
  const dados = MOCK[periodo];
  const navigate = useNavigate();

  // Função auxiliar para mostrar tendência com ícone
  const renderTendencia = (delta: number | null) => {
    if (delta === null) return null;
    
    return (
      <span className={
        `font-medium text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
          delta > 0 
            ? "bg-green-100 text-green-700" 
            : delta < 0 
              ? "bg-red-100 text-red-700" 
              : "bg-gray-100 text-gray-500"
        }`
      }>
        {delta > 0 ? <HiArrowNarrowUp /> : delta < 0 ? <HiArrowNarrowDown /> : null}
        {delta !== 0 ? (delta > 0 ? "+" : "") + delta : "—"}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-16">
      {/* Header com alinhamento central */}
        <
          Header
        />

        <div className="mx-auto max-w-md w-full mt-5 bg-white border border-gray-100 rounded-lg shadow-sm py-3 px-4">
          <h1 className="font-extrabold text-xl md:text-2xl text-purple-700 text-center">
            Relatórios
          </h1>
        </div>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 mt-15">
        {/* Resumo em cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10">
          {/* Card: Total de serviços */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Total de serviços</p>
                <h2 className="text-3xl font-bold text-gray-800 flex items-end gap-2">
                  {ptBR(dados.totalServ)}
                  {renderTendencia(dados.deltaServ)}
                </h2>
              </div>
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                <HiOutlineDocumentReport size={24} />
              </div>
            </div>
          </article>
          
          {/* Card: Valor total */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Valor total</p>
                <h2 className="text-3xl font-bold text-gray-800 flex items-end gap-2">
                  {ptBR(dados.valor, true)}
                  {renderTendencia(dados.deltaValor)}
                </h2>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <FaMoneyBill1Wave size={24} />
              </div>
            </div>
          </article>
          
          {/* Card: Ticket médio */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Ticket médio</p>
                <h2 className="text-3xl font-bold text-gray-800 flex items-end gap-2">
                  {ptBR(dados.ticket, true)}
                  {renderTendencia(dados.ticketDelta)}
                </h2>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <FaMoneyBillTrendUp size={24} />
              </div>
            </div>
          </article>
        </section>

        {/* Serviços mais vendidos - Design mais moderno */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaChartSimple className="text-purple-600" size={20} />
              <h2 className="font-bold text-xl text-gray-800">Serviços Mais Vendidos</h2>
            </div>
            <div className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
              {periodo === "dia" ? "Hoje" : periodo === "mes" ? "Este mês" : "Este ano"}
            </div>
          </div>
          
          {/* Lista de serviços */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="text-left py-4 px-6 font-semibold">Serviço</th>
                  <th className="text-center py-4 px-4 font-semibold">Quantidade</th>
                  <th className="text-right py-4 px-6 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {dados.services.map((service, index) => (
                  <tr key={service.name} className={`${index !== dados.services.length - 1 ? 'border-b' : ''}`}>
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {service.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                        {service.qty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-800">
                      {ptBR(service.value, true)}
                    </td>
                  </tr>
                ))}
                
                {/* Linha de total */}
                <tr className="bg-gray-50 font-bold">
                  <td className="py-4 px-6 text-gray-800">Total</td>
                  <td className="py-4 px-4 text-center text-indigo-700">
                    {ptBR(dados.totalServ)}
                  </td>
                  <td className="py-4 px-6 text-right text-green-700">
                    {ptBR(dados.valor, true)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Botões de ação removidos */}
      </main>
    </div>
  );
}