import { useState, useEffect } from "react";
import { HiTrash, HiStar, HiLockClosed} from "react-icons/hi2";
import { HiRefresh } from "react-icons/hi";
import { AiOutlineShop } from "react-icons/ai";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ClientNavbar from "../../components/ClientNavbar";
import api from "../../services/api";

// Interface baseada na API
type Agendamento = {
  id: number;
  clienteNome: string;
  prestadorNome: string;
  servicoTitulo: string;
  servicoId: number;
  enderecoNegocio: string;
  dataHora: string;
  status: string;
};

// Interface para os horários disponíveis da API
interface HorariosDisponiveis {
  servicoId: number;
  diasDisponiveis: {
    dia: string;
    horarios: string[];
  }[];
}

// Mapear status da API para status do frontend
const mapStatus = (status: string): "pendente" | "finalizado" | "cancelado" => {
  if (status === "CONCLUIDO") return "finalizado";
  if (status === "CANCELADO") return "cancelado";
  return "pendente";
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

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar agendamentos do cliente
  useEffect(() => {
    async function buscarAgendamentos() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/agendamentos/cliente", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        setAgendamentos(response.data);
        console.log("Agendamentos carregados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    }

    buscarAgendamentos();
  }, []);

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
  const [horasDisponiveis, setHorasDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);

  // Buscar horários disponíveis do serviço
  async function buscarHorariosDisponiveis(servicoId: number, data: Date) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    setCarregandoHorarios(true);
    try {
      const dataFormatada = format(data, "yyyy-MM-dd");
      const url = `/servicos/${servicoId}/horarios-disponiveis-data?data=${dataFormatada}`;
      
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const dados: HorariosDisponiveis = response.data;
      
      // A API já retorna os horários para a data específica consultada
      if (dados.diasDisponiveis && dados.diasDisponiveis.length > 0) {
        const horarios = dados.diasDisponiveis[0].horarios;
        setHorasDisponiveis(horarios);
      } else {
        setHorasDisponiveis([]);
      }
    } catch (error: any) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setHorasDisponiveis([]);
    } finally {
      setCarregandoHorarios(false);
    }
  }

  // ==========================

  const cards = agendamentos.filter(ag => {
    const statusMapped = mapStatus(ag.status);
    return (
      (activeTab === "todos" || statusMapped === activeTab) &&
      (
        ag.servicoTitulo.toLowerCase().includes(busca.toLowerCase()) ||
        ag.prestadorNome.toLowerCase().includes(busca.toLowerCase())
      )
    );
  });

  function showPopup(msg: string, ok?: () => void) {
    setPopup({ msg, ok });
  }

  // Atualizar agendamento
  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!modalEdit) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({ msg: "Erro: Token não encontrado" });
      return;
    }

    try {
      // Combinar data e hora selecionados
      const dataSelecionada = format(modalEdit.date, "yyyy-MM-dd");
      const dataHoraCompleta = `${dataSelecionada}T${modalEdit.hora}:00`;
      
      // Requisição PUT para atualizar o agendamento
      await api.put(`/agendamentos/${modalEdit.ag.id}`, {
        dataHora: dataHoraCompleta
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup({ msg: "Agendamento atualizado com sucesso!" });
      setModalEdit(null);
      setHorasDisponiveis([]);
      
      // Recarregar agendamentos após atualização
      const response = await api.get("/agendamentos/cliente", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
      
    } catch (error: any) {
      console.error("Erro ao atualizar agendamento:", error);
      setPopup({ msg: "Erro ao atualizar agendamento. Tente novamente." });
    }
  }

  // Cancelar agendamento
  async function handleCancelarAgendamento(agendamentoId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({ msg: "Erro: Token não encontrado" });
      return;
    }

    try {
      await api.delete(`/agendamentos/${agendamentoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup({ msg: "Agendamento cancelado com sucesso!" });
      
      // Recarregar agendamentos após cancelamento
      const response = await api.get("/agendamentos/cliente", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
      
    } catch (error: any) {
      console.error("Erro ao cancelar agendamento:", error);
      setPopup({ msg: "Erro ao cancelar agendamento. Tente novamente." });
    }
  }

  // Salvar avaliação
  async function handleAvaliarSave(e: React.FormEvent) {
    e.preventDefault();
    if (!modalAval) return;

    // Validação: nota deve ser maior que 0
    if (modalAval.estrelas === 0) {
      setPopup({ msg: "Por favor, selecione uma nota (estrelas) para o serviço." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({ msg: "Erro: Token não encontrado" });
      return;
    }

    try {
      // Requisição POST para criar a avaliação
      await api.post("/avaliacoes", {
        agendamentoId: modalAval.ag.id,
        nota: modalAval.estrelas,
        comentario: modalAval.comentario
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup({ msg: "Avaliação enviada com sucesso!" });
      setModalAval(null);
      
      // Recarregar agendamentos após avaliação
      const response = await api.get("/agendamentos/cliente", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
      
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      setPopup({ msg: "Erro ao enviar avaliação. Tente novamente." });
    }
  }

  return (
    <div className="bg-[#f6f5fb] min-h-screen">
      {/* Modern Header */}
      <ClientNavbar />

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
          {loading ? (
            <div className="text-center text-purple-600 mt-24">
              Carregando agendamentos...
            </div>
          ) : (
            cards.map((ag) => {
              const statusMapped = mapStatus(ag.status);
              const isFinalizado = statusMapped === "finalizado";
              const isPendente = statusMapped === "pendente";
              
              // Parse da dataHora e formatação
              const dataHora = parseISO(ag.dataHora);
              const dataFormatada = format(dataHora, "dd/MM/yy 'às' HH:mm");
              const hora = format(dataHora, "HH:mm");
              
              return (
                <div key={ag.id}
                   className="group bg-white rounded-2xl shadow-lg p-3 sm:p-6 flex flex-col gap-4 md:gap-0 md:flex-row justify-between transition-all 
                              relative hover:shadow-2xl hover:-translate-y-1 mb-2 overflow-hidden">
                  {/* Borda gradiente no topo */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                  <span className={`
                    absolute left-0 top-8 w-2 h-12 rounded-xl
                    ${statusMapped === "pendente" ? "bg-purple-500 animate-pulse" : ""}
                    ${statusMapped === "cancelado" ? "bg-red-500" : ""}
                    ${statusMapped === "finalizado" ? "bg-green-600" : ""}
                  `}></span>

                  <div className="flex flex-col flex-1 pl-4 sm:pl-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`mr-1 w-3 h-3 rounded-full shadow ${STATUS[statusMapped].dot} animate-pulse`} />
                      <h2 className="font-extrabold text-lg">{ag.servicoTitulo}</h2>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${STATUS[statusMapped].color} animate-fade`}>
                        {STATUS[statusMapped].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <AiOutlineShop size={24} />
                      <span className="font-semibold">{ag.enderecoNegocio}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <span>Parceiro: {ag.prestadorNome}</span>
                    </div>
                    <div className="mt-2 text-black font-bold text-base">
                      <span>{dataFormatada}</span>
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
                      onClick={async () => {
                        if (isPendente) {
                          setModalEdit({
                            ag,
                            date: dataHora,
                            hora: hora
                          });
                          // Buscar horários disponíveis para o serviço na data do agendamento
                          const servicoIdParaBuscar = ag.servicoId || 1;
                          await buscarHorariosDisponiveis(servicoIdParaBuscar, dataHora);
                        }
                      }}
                      title={isPendente ? "Editar agendamento" : "Apenas agendamentos pendentes podem ser editados"}
                      disabled={!isPendente}
                    >
                      <HiRefresh className="text-lg" /> Editar
                    </button>
                    <button
                      className={`w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm
                        ${isPendente ? "cursor-pointer" : "bg-gray-200 text-gray-400 opacity-70 cursor-not-allowed"}`}
                      onClick={() => {
                        if (isPendente) {
                          showPopup("Deseja cancelar este agendamento?", () => handleCancelarAgendamento(ag.id));
                        }
                      }}
                      title={isPendente ? "Cancelar agendamento" : "Apenas agendamentos pendentes podem ser cancelados"}
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
            })
          )}
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
                onSelect={async (d) => {
                  if (d) {
                    setModalEdit(em => em && { ...em, date: d });
                    // Buscar horários disponíveis para a nova data
                    const agendamentoAtual = agendamentos.find(ag => ag.id === modalEdit.ag.id);
                    if (agendamentoAtual) {
                      const servicoIdParaBuscar = agendamentoAtual.servicoId || 1;
                      await buscarHorariosDisponiveis(servicoIdParaBuscar, d);
                    }
                  }
                }}
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
                disabled={carregandoHorarios}
              >
                <option value="">
                  {carregandoHorarios ? "Carregando horários..." : "Selecione um horário"}
                </option>
                {horasDisponiveis.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <span className="text-sm text-gray-400 mt-1 block">Serviço: {modalEdit.ag.servicoTitulo}</span>
              {horasDisponiveis.length === 0 && !carregandoHorarios && (
                <span className="text-sm text-red-500 mt-1 block">
                  Nenhum horário disponível para esta data
                </span>
              )}
            </div>
            <div className="flex w-full mt-1 gap-4">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer"
                onClick={() => {
                  setModalEdit(null);
                  setHorasDisponiveis([]);
                }}>Cancelar</button>
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
              {modalAval.ag.servicoTitulo}
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
            <div className="flex gap-4">
              {popup.ok ? (
                <>
                  <button
                    className="px-7 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold shadow hover:bg-gray-300 cursor-pointer"
                    onClick={() => setPopup(null)}
                  >
                    Não
                  </button>
                  <button
                    className="px-7 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 cursor-pointer"
                    onClick={() => {
                      popup.ok?.();
                      setPopup(null);
                    }}
                  >
                    Sim
                  </button>
                </>
              ) : (
                <button
                  className="px-7 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 cursor-pointer"
                  onClick={() => setPopup(null)}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}