import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiTrash, HiStar, HiCalendar, HiLockClosed } from "react-icons/hi2"; // HiLockClosed = cadeado
import { HiRefresh } from "react-icons/hi";
import { AiOutlineShop } from "react-icons/ai";

const TABS = [
  { tag: "todos", nome: "Todos" },
  { tag: "pendente", nome: "Pendentes" },
  { tag: "finalizado", nome: "Finalizados" },
  { tag: "cancelado", nome: "Cancelados" }
];

const STATUS = {
  pendente: { label: "Pendente", color: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  finalizado: { label: "Finalizado", color: "bg-green-100 text-green-700", dot: "bg-green-500" }
};

const AGENDAMENTOS = [
  {
    id: 1,
    servico: "Corte social",
    profissional: "Cabeleireiro Leilo",
    status: "pendente",
    data: { dia: 30, mes: "Janeiro", ano: 2020, hora: "17:30h" },
  },
  {
    id: 2,
    servico: "Corte simples",
    profissional: "Cabeleireiro do Zeca",
    status: "cancelado",
    data: { dia: 30, mes: "Janeiro", ano: 2020, hora: "17:30h" },
  },
  {
    id: 3,
    servico: "Corte com barba",
    profissional: "Cabeleireiro Dhiegheutes",
    status: "finalizado",
    data: { dia: 30, mes: "Janeiro", ano: 2020, hora: "17:30h" },
  },
];

export default function AgendamentosClienteNovo() {
  const [activeTab, setActiveTab] = useState("todos");
  const [busca, setBusca] = useState("");
  const [popup, setPopup] = useState<{ msg: string; ok?: () => void } | null>(null);
  const [avaliarHover, setAvaliarHover] = useState<string | null>(null); // id do card ao passar
  const navigate = useNavigate();

  const cards = AGENDAMENTOS.filter(ag =>
    (activeTab === "todos" || ag.status === activeTab) &&
    (
      ag.servico.toLowerCase().includes(busca.toLowerCase()) ||
      ag.profissional.toLowerCase().includes(busca.toLowerCase())
    )
  );

  function showPopup(msg: string, ok?: () => void) {
    setPopup({ msg, ok });
  }

  return (
    <div className="bg-[#f6f5fb] min-h-screen">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-b-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/perfilCliente")}
          className="text-purple-600 hover:bg-purple-50 rounded-full p-2 transition cursor-pointer"
          title="Voltar ao perfil"
        >
          <svg width={26} height={26} fill="none" viewBox="0 0 24 24" className="cursor-pointer">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Agendamentos</h1>
        </div>
        <button
          className="text-gray-400 hover:text-purple-600 p-2 rounded-full transition cursor-pointer"
          title="Ajuda"
        >
          <HiCalendar size={22} />
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-2">
        {/* Busca */}
        <div className="my-6 flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Buscar serviço ou profissional..."
            className="w-full md:w-auto flex-1 px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-200"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.tag}
                className={`
                  px-4 py-2 rounded-xl font-semibold cursor-pointer
                  text-sm transition-all duration-150
                  ${activeTab === tab.tag
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-100"
                  }
                `}
                onClick={() => setActiveTab(tab.tag)}
              >
                {tab.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <section className="flex flex-col gap-8">
          {cards.map((ag) => {
            const isFinalizado = ag.status === "finalizado";
            return (
              <div key={ag.id}
                 className="group bg-white rounded-2xl shadow-lg p-3 sm:p-6 flex flex-col gap-4 md:gap-0 md:flex-row justify-between transition-all border-t-4 
                            relative hover:shadow-2xl hover:-translate-y-1 mb-2">
                <span className={`
                  absolute left-0 top-8 w-2 h-12 rounded-xl
                  ${ag.status === "pendente" ? "bg-purple-500 animate-pulse" : ""}
                  ${ag.status === "cancelado" ? "bg-red-500" : ""}
                  ${ag.status === "finalizado" ? "bg-green-600" : ""}
                `}></span>

                <div className="flex flex-col flex-1 pl-4 sm:pl-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`mr-1 w-3 h-3 rounded-full shadow ${STATUS[ag.status as keyof typeof STATUS].dot} animate-pulse`} />
                    <h2 className="font-extrabold text-lg">{ag.servico}</h2>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${STATUS[ag.status as keyof typeof STATUS].color} animate-fade`}>
                      {STATUS[ag.status as keyof typeof STATUS].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <AiOutlineShop size={24} />
                    <span className="font-semibold">{ag.profissional}</span>
                    <span className="mx-2 text-purple-200">|</span>
                    <HiStar className="text-yellow-500" /> 4.9 {/* Simulado */}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-black font-bold text-base">
                    <span><span className="font-bold">Dia:</span> {ag.data.dia}</span>
                    <span><span className="font-bold">Hora:</span> {ag.data.hora}</span>
                    <span><span className="font-bold">Mês:</span> {ag.data.mes}</span>
                    <span><span className="font-bold">Ano:</span> {ag.data.ano}</span>
                  </div>
                </div>
                {/* Rodapé ações */}
                <div className="flex flex-col sm:flex-row md:flex-col flex-none items-stretch gap-2 md:gap-3 mt-2 md:mt-0 ml-0 md:ml-6 w-full md:w-auto">
                  <button
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow hover:brightness-105 text-sm cursor-pointer"
                    onClick={() => showPopup("Reserva refeita com sucesso!")}
                    title="Reservar novamente"
                  >
                    <HiRefresh size={18} /> Reservar novamente
                  </button>
                  <button
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm cursor-pointer"
                    onClick={() => showPopup("Agendamento cancelado!")}
                    title="Cancelar"
                  >
                    <HiTrash size={18} /> Cancelar
                  </button>
                  <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow border transition 
                      ${isFinalizado
                        ? "text-yellow-700 bg-yellow-100 border-yellow-300 hover:bg-yellow-200 hover:text-yellow-900 cursor-pointer"
                        : "bg-gray-200 text-gray-400 border-gray-200 opacity-70 cursor-not-allowed"
                    }`}
                    onClick={() => isFinalizado && showPopup("Página de avaliação... (implementar rota depois)")}
                    title={isFinalizado ? "Avaliar" : "Apenas agendamentos finalizados podem ser avaliados"}
                    disabled={!isFinalizado}
                    onMouseEnter={() => setAvaliarHover(String(ag.id))}
                    onMouseLeave={() => setAvaliarHover(null)}
                  >
                    {isFinalizado ? (
                      <>
                        <HiStar size={18} /> Avaliar
                      </>
                    ) : (
                      <>
                        <HiLockClosed size={18} />
                        <span>Avaliar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
        {cards.length === 0 && (
          <div className="text-center text-gray-400 mt-24">
            Nenhum agendamento encontrado.
          </div>
        )}
      </main>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/[.32]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 min-w-[300px] max-w-xs">
            <span className="text-lg font-bold text-purple-700 text-center">{popup.msg}</span>
            <button
              className="px-7 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 cursor-pointer"
              onClick={() => {
                setPopup(null);
                popup.ok?.();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}