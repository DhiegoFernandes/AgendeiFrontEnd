import { useState } from "react";
import { HiOutlineDocumentReport, HiOutlineArrowLeft, HiArrowNarrowUp, HiArrowNarrowDown } from "react-icons/hi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Mock dos dados por período (igual ao seu JS)
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
  // Percentual para barra
  const maxQty = Math.max(...dados.services.map(s => s.qty), 1);
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f5fb] min-h-screen pb-16">
      {/* Header gradient */}
      <header className="bg-gradient-to-br from-purple-600 to-purple-400 shadow text-white rounded-b-3xl pt-9 pb-6 px-4 flex flex-col items-center">
        <button className="self-start flex items-center mb-2 transition hover:text-white/70 font-bold"
          onClick={() => navigate("/parceiro/perfil")}
        >
          <HiOutlineArrowLeft size={24} /> <span className="ml-1">Voltar ao perfil</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center drop-shadow mb-3">
          Relatório de Serviços
        </h1>
        {/* Tabs */}
        <nav className="flex gap-2 bg-white/10 px-2 py-1 rounded-full shadow mb-2" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={
                "px-5 py-2 rounded-full font-bold text-base transition-all " +
                (periodo === tab.key
                  ? "bg-white text-purple-600 shadow scale-105"
                  : "bg-transparent text-white/90 hover:bg-white/20")
              }
              role="tab"
              aria-selected={periodo === tab.key}
              onClick={() => setPeriodo(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* KPIs */}
      <main className="max-w-4xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 px-3">
          {/* Total de serviços */}
          <article className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 text-gray-400 text-lg">
              <HiOutlineDocumentReport /> <span className="font-bold">Total de serviços</span>
            </div>
            <div className="flex items-end gap-2 justify-center mt-2">
              <span className="text-3xl font-extrabold text-purple-700">{ptBR(dados.totalServ)}</span>
              <span className={
                  "font-bold text-xs ml-1 px-2 py-0.5 rounded-full " +
                  (dados.deltaServ > 0
                    ? "bg-green-100 text-green-700 flex items-center gap-0.5"
                    : dados.deltaServ < 0
                      ? "bg-red-100 text-red-700 flex items-center gap-0.5"
                      : "bg-gray-100 text-gray-500")
                }>
                {dados.deltaServ > 0 ? <HiArrowNarrowUp className="inline" /> : null}
                {dados.deltaServ < 0 ? <HiArrowNarrowDown className="inline" /> : null}
                {dados.deltaServ !== null && `${dados.deltaServ > 0 ? "+" : ""}${dados.deltaServ}%`}
              </span>
            </div>
          </article>
          {/* Valor total */}
          <article className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 text-gray-400 text-lg">
              <FaMoneyBill1Wave /> <span className="font-bold">Valor total</span>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-extrabold text-purple-700">{ptBR(dados.valor, true)}</span>
              <span className={
                  "font-bold text-xs ml-1 px-2 py-0.5 rounded-full " +
                  (dados.deltaValor > 0
                    ? "bg-green-100 text-green-700 flex items-center gap-0.5"
                    : dados.deltaValor < 0
                      ? "bg-red-100 text-red-700 flex items-center gap-0.5"
                      : "bg-gray-100 text-gray-500")
                }>
                {dados.deltaValor > 0 ? <HiArrowNarrowUp className="inline" /> : null}
                {dados.deltaValor < 0 ? <HiArrowNarrowDown className="inline" /> : null}
                {dados.deltaValor !== null && `${dados.deltaValor > 0 ? "+" : ""}${dados.deltaValor}%`}
              </span>
            </div>
          </article>
          {/* Ticket médio */}
          <article className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 text-gray-400 text-lg">
              <FaMoneyBillTrendUp /> <span className="font-bold">Ticket médio</span>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-extrabold text-purple-700">{ptBR(dados.ticket, true)}</span>
              <span className={
                "font-bold text-xs ml-1 px-2 py-0.5 rounded-full " +
                (typeof dados.ticketDelta === "number"
                  ? (dados.ticketDelta > 0
                    ? "bg-green-100 text-green-700 flex items-center gap-0.5"
                    : dados.ticketDelta < 0
                      ? "bg-red-100 text-red-700 flex items-center gap-0.5"
                      : "bg-gray-100 text-gray-500")
                  : "bg-gray-100 text-gray-500"
                )}>
                {typeof dados.ticketDelta === "number"
                  ? <>
                    {dados.ticketDelta > 0 && <HiArrowNarrowUp className="inline" />}
                    {dados.ticketDelta < 0 && <HiArrowNarrowDown className="inline" />}
                    {dados.ticketDelta > 0 ? "+" : ""}
                    {dados.ticketDelta}%
                  </>
                  : "—"}
              </span>
            </div>
          </article>
        </section>

        {/* Top serviços vendidos */}
        <section className="bg-white shadow-lg rounded-2xl mt-8 mx-2 p-7 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-xl text-gray-900">Serviços mais vendidos</h2>
            <span className="text-gray-500 font-medium">Total: {dados.totalServ}</span>
          </div>
          <ul className="flex flex-col gap-7">
            {dados.services.map((s) => {
              const pct = Math.max(1, Math.round((s.qty / maxQty) * 100));
              return (
                <li key={s.name} className="flex flex-col w-full">
                  <div className="flex flex-row justify-between items-center mb-1">
                    <div>
                      <span className="font-extrabold text-lg text-gray-800">{s.name}</span>
                      <span className="ml-3 text-sm text-gray-500 font-semibold">
                        {s.qty} serviço{s.qty > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="font-extrabold text-lg">{ptBR(s.value, true)}</span>
                      <span className="text-gray-400 text-sm font-bold">{pct}%</span>
                    </div>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <span
                      className={
                        "absolute left-0 top-0 h-full rounded-full transition-all duration-700 bg-gradient-to-r from-purple-500 to-purple-400"
                      }
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}