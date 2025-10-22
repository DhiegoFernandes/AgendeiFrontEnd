import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiTrash, HiStar, HiCalendar, HiLockClosed} from "react-icons/hi2";
import { HiRefresh } from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlineShop } from "react-icons/ai";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// EXEMPLO de interface, ajuste conforme seu backend/DTO:
type Agendamento = {
  id: number;
  servico: string;
  profissional: string;
  status: "pendente" | "finalizado" | "cancelado";
  data: { dia: number; mes: string; ano: number; hora: string };
};

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

export default function AgendamentosClienteNovo() {
  const navigate = useNavigate();

  // ==========================
  // SUA API: Monte os states a partir dos dados reais!
  // ==========================
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  // Carregue usando useEffect e sua API
  useEffect(() => {
    // Exemplo:
    // fetch("/api/agendamentosCliente")
    //   .then(r => r.json())
    //   .then(setAgendamentos);
  }, []);
  // ==========================

  const [activeTab, setActiveTab] = useState("todos");
  const [busca, setBusca] = useState("");
  const [popup, setPopup] = useState<{ msg: string; ok?: () => void } | null>(null);
  const [modalEdit, setModalEdit] = useState<{
    ag: Agendamento,
    date: Date,
    hora: string
  } | null>(null);
  const [modalAval, setModalAval] = useState<{
    ag: Agendamento,
    estrelas: number,
    comentario: string
  } | null>(null);
  const [hoverStar, setHoverStar] = useState<number | null>(null);

  // ==========================
  // LISTA DE HORÁRIOS DISPONÍVEIS PARA O MODAL ATUALIZAR (mande da API)
  // ==========================
  const [horasDisponiveis, setHorasDisponiveis] = useState<string[]>([
    // "09:00", "10:30", ... // Preencha da sua API
  ]);
  // Exemplo para buscar horários disponíveis ao abrir modal, pela data/serviço
  useEffect(() => {
    if (modalEdit) {
      // fetch(`/api/horarios-disponiveis?date=${...}&servico=${modalEdit.ag.servico}`)
      //   .then(r => r.json())
      //   .then(setHorasDisponiveis);
      setHorasDisponiveis([
        "09:00", "10:30", "12:00", "14:00", "15:30", "17:30", "19:00"
      ]); // Remova após integração
    }
  }, [modalEdit]);

  // ==========================

  const cards = agendamentos.filter(ag =>
    (activeTab === "todos" || ag.status === activeTab) &&
    (
      ag.servico.toLowerCase().includes(busca.toLowerCase()) ||
      ag.profissional.toLowerCase().includes(busca.toLowerCase())
    )
  );

  function showPopup(msg: string, ok?: () => void) {
    setPopup({ msg, ok });
  }

  // Atualizar agendamento
  function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (modalEdit) {
      // =============================
      // CHAME SUA API PARA ATUALIZAR DATA/HORA DE AGENDAMENTO modalEdit.ag.id!
      // await fetch(`/api/agendamentos/${modalEdit.ag.id}`, { method: "PUT", body: ... });
      // Atualize lista com novo fetch, se precisar:
      // fetch("/api/agendamentosCliente").then(...);
      // Atualize UI localmente se quiser testes sem API:
      // setAgendamentos(prev => prev.map(a => a.id === modalEdit.ag.id
      //    ? { ...a, data: { ...a.data, ...suaNovaDataEhHora } }
      //    : a
      // ));
      // =============================
      setPopup({ msg: "Agendamento atualizado com sucesso!" });
      setModalEdit(null);
    }
  }

  // Salvar avaliação
  function handleAvaliarSave(e: React.FormEvent) {
    e.preventDefault();
    if (modalAval) {
      // =============================
      // CHAME SUA API PARA ENVIAR AVALIAÇÃO (modalAval.estrelas, modalAval.comentario)
      // await fetch('/api/avaliacoes', { ... })
      // =============================
      setPopup({ msg: "Avaliação enviada com sucesso!" });
      setModalAval(null);
    }
  }

  return (
    <div className="bg-[#f6f5fb] min-h-screen">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-b-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/cliente/perfil")}
          className="text-purple-600 hover:bg-purple-50 rounded-full p-2 transition cursor-pointer"
          title="Voltar ao perfil"
        >
          <HiArrowLeft size={26}/>
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
            const isPendente = ag.status === "pendente";
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
                    <HiStar className="text-yellow-500" /> 4.9
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
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow border transition
                      ${isPendente
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-400 hover:bg-purple-700 cursor-pointer"
                        : "bg-gray-200 text-gray-400 border-gray-200 opacity-70 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      isPendente && setModalEdit({
                        ag,
                        date: new Date(),
                        hora: ag.data.hora
                      })
                    }
                    title={isPendente ? "Atualizar agendamento" : "Apenas agendamentos pendentes podem ser atualizados"}
                    disabled={!isPendente}
                  >
                    <HiRefresh className="text-lg" /> Atualizar
                  </button>
                  <button
                    className={`w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm
                      ${isPendente ? "cursor-pointer" : "bg-gray-200 text-gray-400 opacity-70 cursor-not-allowed"}`}
                    onClick={() => isPendente && showPopup("Agendamento cancelado!")}
                    title="Cancelar"
                    disabled={!isPendente}
                  >
                    <HiTrash size={18} /> Cancelar
                  </button>
                  <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow border transition 
                      ${isFinalizado
                        ? "bg-yellow-400 text-white border-yellow-400 hover:bg-yellow-500 cursor-pointer"
                        : "bg-gray-200 text-gray-400 border-gray-200 opacity-70 cursor-not-allowed"
                    }`}
                    onClick={() => isFinalizado && setModalAval({ ag, estrelas: 0, comentario: "" })}
                    title={isFinalizado ? "Avaliar" : "Apenas agendamentos finalizados podem ser avaliados"}
                    disabled={!isFinalizado}
                    // onMouseEnter={() => setHoverStar(String(ag.id))}
                    // onMouseLeave={() => setHoverStar(null)}
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

      {/* Modal: Atualizar (apenas data e hora) */}
      {modalEdit && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-lg p-8 flex flex-col gap-6 items-center"
            autoComplete="off"
            onSubmit={handleEditSave}
          >
            <h2 className="text-xl text-center font-bold text-purple-700 mb-3">Atualizar agendamento</h2>
            <div className="w-full">
              <label className="font-bold text-gray-700 block mb-1">Data</label>
              <DayPicker
                mode="single"
                selected={modalEdit.date}
                onSelect={d => d && setModalEdit(em => em && { ...em, date: d })}
                locale={ptBR}
                weekStartsOn={0}
                fromDate={addDays(new Date(), -7)}
                toDate={addDays(new Date(), 365)}
                modifiersClassNames={{
                  selected: "bg-purple-600 text-white !rounded-lg hover:bg-purple-700",
                  today: "text-purple-600 font-bold",
                }}
                className="max-w-xs"
              />
            </div>
            <div className="w-full">
              <label className="font-bold text-gray-700 block mb-1">Hora</label>
              <select
                className="w-full px-4 py-2 rounded-lg border-2 border-purple-200 focus:ring-2 focus:ring-purple-400 shadow outline-none bg-white"
                value={modalEdit.hora}
                onChange={e => setModalEdit(em => em ? { ...em, hora: e.target.value } : em)}
                required
              >
                {/* {HORAS_DISPONIVEIS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))} */}
              </select>
            </div>
            <div className="flex w-full mt-1 gap-4">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer"
                onClick={() => setModalEdit(null)}>Cancelar</button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
              >Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Avaliar */}
      {modalAval && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-lg p-8 flex flex-col gap-6 items-center"
            onSubmit={handleAvaliarSave}
            autoComplete="off"
          >
            <h2 className="text-xl text-center font-bold text-purple-700 mb-1">Avaliar serviço</h2>
            <div className="w-full text-left font-bold text-gray-700 mb-1">
              {modalAval.ag.servico}
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHoverStar(i)}
                  onMouseLeave={() => setHoverStar(null)}
                  onClick={() => setModalAval(m => m && { ...m, estrelas: i })}
                  className="mx-0.5 transition-transform"
                  style={{
                    transform: ((hoverStar || modalAval.estrelas) >= i)
                      ? "scale(1.18) rotate(-8deg)"
                      : "scale(1)"
                  }}
                >
                  <HiStar
                    size={30}
                    className={
                      ((hoverStar || modalAval.estrelas) >= i)
                        ? "text-purple-600 drop-shadow-lg"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Como foi sua experiência? (até 280 caracteres)"
              maxLength={280}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
              value={modalAval.comentario}
              required
              onChange={e =>
                setModalAval(m => m && { ...m, comentario: e.target.value })
              }
              rows={4}
            />
            <div className="w-full flex justify-end text-sm text-gray-400">
              {modalAval.comentario.length}/280
            </div>
            <div className="flex w-full mt-1 gap-4">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer"
                onClick={() => setModalAval(null)}>Cancelar</button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
              >Enviar avaliação</button>
            </div>
          </form>
        </div>
      )}

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/[.32]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 min-w-[300px] max-w-xs">
            <span className="text-lg font-bold text-purple-700 text-center">{popup.msg}</span>
            <button
              className="px-7 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 cursor-pointer"
              onClick={() => setPopup(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}