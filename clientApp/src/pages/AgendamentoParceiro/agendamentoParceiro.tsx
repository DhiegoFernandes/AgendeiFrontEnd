import { useState, useEffect } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaPen, FaCalendarCheck } from "react-icons/fa";
import Header from "../../components/Header";
import api from "../../services/api";

// Interface atualizada para corresponder aos dados da API
interface Agendamento {
  id: number;
  clienteNome: string;
  prestadorNome: string;
  servicoTitulo: string;
  servicoId: number;
  enderecoNegocio: string;
  dataHora: string;
  status: string;
}

// Interface para os horários disponíveis da API
interface HorariosDisponiveis {
  servicoId: number;
  diasDisponiveis: {
    dia: string;
    horarios: string[];
  }[];
}

export default function AgendaPrestador() {
  const [data, setData] = useState<Date>(new Date()); // Data escolhida no calendário
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState<Agendamento[]>([]);
  const [modalEdit, setModalEdit] = useState<{
    id: number,
    servico: string,
    index: number,
    date: Date,
    hora: string
  } | null>(null);
  const [popup, setPopup] = useState<false | string>(false);
  const [modalCancelar, setModalCancelar] = useState<{
    id: number;
    clienteNome: string;
  } | null>(null);
  const [modalConcluir, setModalConcluir] = useState<{
    id: number;
    clienteNome: string;
  } | null>(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);

  // --- BUSCAR AGENDAMENTOS DO PRESTADOR ---
  useEffect(() => {
    async function buscarAgendamentos() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/agendamentos/prestador", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        setAgendamentos(response.data);
        console.log("Agendamentos carregados:", response.data);
        console.log("Primeiro agendamento:", response.data[0]);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        setAgendamentos([]);
      }
    }

    buscarAgendamentos();
  }, []);

  // --- FILTRAR AGENDAMENTOS POR DATA SELECIONADA ---
  useEffect(() => {
    const filtrados = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.dataHora);
      return isSameDay(dataAgendamento, data);
    });
    
    setAgendamentosFiltrados(filtrados);
  }, [agendamentos, data]);

  // --- BUSCAR HORÁRIOS DISPONÍVEIS DO SERVIÇO ---
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
        setHorariosDisponiveis(horarios);
      } else {
        setHorariosDisponiveis([]);
      }
    } catch (error: any) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setHorariosDisponiveis([]);
    } finally {
      setCarregandoHorarios(false);
    }
  }

  async function handleEditar(ag: Agendamento, idx: number) {
    const dataAgendamento = new Date(ag.dataHora);
    const hora = format(dataAgendamento, "HH:mm");
    
    setModalEdit({
      id: ag.id,
      index: idx,
      date: dataAgendamento,
      hora: hora,
      servico: ag.servicoTitulo
    });

    // Buscar horários disponíveis para o serviço na data do agendamento
    const servicoIdParaBuscar = ag.servicoId;
    await buscarHorariosDisponiveis(servicoIdParaBuscar, dataAgendamento);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalEdit) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Erro: Token de autenticação não encontrado!");
      return;
    }

    try {
      // Combinar data e hora selecionados
      const dataSelecionada = format(modalEdit.date, "yyyy-MM-dd");
      const dataHoraCompleta = `${dataSelecionada}T${modalEdit.hora}:00`;
      
      // Requisição PUT para atualizar o agendamento
      await api.put(`/agendamentos/${modalEdit.id}`, {
        dataHora: dataHoraCompleta
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup("Agendamento atualizado com sucesso!");
      setModalEdit(null);
      setHorariosDisponiveis([]);
      
      // Recarregar agendamentos após atualização
      const response = await api.get("/agendamentos/prestador", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
      
    } catch (error: any) {
      console.error("Erro ao atualizar agendamento:", error);
      setPopup("Erro ao atualizar agendamento. Tente novamente.");
    }
  }

  // Função para abrir modal de confirmação de cancelamento
  function handleCancelarAgendamento(agendamento: Agendamento) {
    setModalCancelar({
      id: agendamento.id,
      clienteNome: agendamento.clienteNome
    });
  }

  // Função para confirmar cancelamento
  async function confirmarCancelamento() {
    if (!modalCancelar) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Erro: Token de autenticação não encontrado!");
      return;
    }

    try {
      // Requisição DELETE para cancelar o agendamento
      await api.delete(`/agendamentos/${modalCancelar.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup("Agendamento cancelado com sucesso!");
      setModalCancelar(null);
      
      // Recarregar agendamentos após cancelamento
      const response = await api.get("/agendamentos/prestador", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      setPopup("Erro ao cancelar agendamento. Tente novamente.");
    }
  }

  // Função para abrir modal de confirmação de conclusão
  function handleConcluirAgendamento(agendamento: Agendamento) {
    setModalConcluir({
      id: agendamento.id,
      clienteNome: agendamento.clienteNome
    });
  }

  // Função para confirmar conclusão
  async function confirmarConclusao() {
    if (!modalConcluir) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Erro: Token de autenticação não encontrado!");
      return;
    }

    try {
      // Requisição PUT para concluir o agendamento
      await api.put(`/agendamentos/${modalConcluir.id}/concluir`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPopup("Agendamento concluído com sucesso!");
      setModalConcluir(null);
      
      // Recarregar agendamentos após conclusão
      const response = await api.get("/agendamentos/prestador", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      setPopup("Erro ao concluir agendamento. Tente novamente.");
    }
  }



  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-16">
      {/* Header */}
        <
          Header
        />

      {/* Main grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-2 z-0 mt-10">
        {/* Card calendário */}
        <section className="bg-white rounded-2xl shadow-lg px-6 md:px-8 py-7 min-h-[340px] flex flex-col">
          <h2 className="font-bold text-lg mb-2 text-gray-700">Selecione uma data</h2>
          <DayPicker
            mode="single"
            selected={data}
            onSelect={d => d && setData(d)}
            locale={ptBR}
            weekStartsOn={0}
            fromDate={addDays(new Date(), -7)}
            toDate={addDays(new Date(), 365)}
            modifiersClassNames={{
              selected: "bg-purple-600 text-white !rounded-lg hover:bg-purple-700",
              today: "text-purple-600 font-bold",
            }}
            className="w-full max-w-xs"
          />
        </section>

        {/* Card agendamentos */}
        <section className="bg-white rounded-2xl shadow-lg px-6 md:px-8 py-7 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <h3 className="font-bold text-gray-900 text-lg">
              {format(data, "PPPP", { locale: ptBR })}
            </h3>
            <span className="text-gray-400 text-base">
              {agendamentosFiltrados.length} agendamento{agendamentosFiltrados.length !== 1 && "s"}
            </span>
          </div>
          <div className="flex flex-col gap-4 mt-1">
            {/* Renderize seus agendamentos aqui */}
            {agendamentosFiltrados.length ? agendamentosFiltrados.map((ag, idx) => {
              const dataAgendamento = new Date(ag.dataHora);
              const hora = format(dataAgendamento, "HH:mm");
              
              return (
                <div
                  key={ag.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between rounded-xl border border-gray-100 py-4 px-5 bg-purple-50/20 shadow-sm transition hover:bg-purple-50"
                >
                  <div className="flex-1 flex flex-col justify-center gap-0.5">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-lg text-gray-800">{ag.clienteNome}</span>
                    </div>
                    <span className="text-gray-500 font-semibold">{ag.servicoTitulo}</span>
                    <span className="text-gray-500 text-sm">{ag.prestadorNome}</span>
                    <span className="text-gray-400 text-sm">{ag.enderecoNegocio}</span>
                    <div className="flex items-start">
                      <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                        ag.status === 'CONCLUIDO' ? 'bg-green-200 text-green-800 font-semibold' :
                        ag.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' :
                        ag.status === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ag.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0">
                    <span className="rounded-xl px-4 py-2 font-bold bg-gradient-to-r from-purple-50 to-white text-purple-600 text-base shadow border border-purple-100 select-none min-w-[72px] text-center">
                      {hora}
                    </span>
                    <div className="flex gap-2 mt-0">
                      <button
                        disabled={ag.status === 'CANCELADO'}
                        className={`px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold shadow transition flex items-center justify-center ${
                          ag.status === 'CANCELADO' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:brightness-105 cursor-pointer'
                        }`}
                        title={ag.status === 'CANCELADO' ? 'Agendamento cancelado' : 'Atualizar'}
                        onClick={() => ag.status !== 'CANCELADO' && handleEditar(ag, idx)}
                      >
                        <FaPen size={14} />
                      </button>
                      <button
                        disabled={ag.status === 'CANCELADO'}
                        className={`px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow transition flex items-center justify-center ${
                          ag.status === 'CANCELADO' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:brightness-105 cursor-pointer'
                        }`}
                        title={ag.status === 'CANCELADO' ? 'Agendamento cancelado' : 'Concluir agendamento'}
                        onClick={() => ag.status !== 'CANCELADO' && handleConcluirAgendamento(ag)}
                      >
                        <FaCalendarCheck size={14} />
                      </button>
                      <button
                        disabled={ag.status === 'CANCELADO'}
                        className={`px-2 py-2 w-[90px] rounded-lg bg-red-500 text-white font-bold shadow transition ${
                          ag.status === 'CANCELADO' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-red-600 cursor-pointer'
                        }`}
                        title={ag.status === 'CANCELADO' ? 'Agendamento cancelado' : 'Cancelar'}
                        onClick={() => ag.status !== 'CANCELADO' && handleCancelarAgendamento(ag)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-gray-400 font-semibold mt-10">
                Nenhum agendamento nesta data.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal apenas data+hora, com horários filtrados */}
      {modalEdit && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-lg p-8 flex flex-col gap-6 items-center"
            autoComplete="off"
            onSubmit={e => {
              e.preventDefault();
              handleSaveEdit(e);
            }}
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
                    const agendamentoAtual = agendamentos.find(ag => ag.id === modalEdit.id);
                    if (agendamentoAtual) {
                      const servicoIdParaBuscar = agendamentoAtual.servicoId;
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
                {horariosDisponiveis.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <span className="text-sm text-gray-400 mt-1 block">Serviço: {modalEdit.servico}</span>
              {horariosDisponiveis.length === 0 && !carregandoHorarios && (
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
                  setHorariosDisponiveis([]);
                }}>Cancelar</button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
              >Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmação de conclusão */}
      {modalConcluir && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-lg min-w-[320px] max-w-sm flex flex-col items-center relative animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              Deseja realmente concluir o agendamento de <strong>{modalConcluir.clienteNome}</strong>?
            </span>
            <div className="flex gap-5 mt-2">
              <button
                className="px-7 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 transition cursor-pointer"
                onClick={confirmarConclusao}
              >
                Sim
              </button>
              <button
                className="px-7 py-2 bg-gray-50 border border-gray-300 text-gray-600 rounded-lg font-bold shadow hover:bg-gray-100 transition cursor-pointer"
                onClick={() => setModalConcluir(null)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de cancelamento */}
      {modalCancelar && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-lg min-w-[320px] max-w-sm flex flex-col items-center relative animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              Deseja realmente cancelar o agendamento de <strong>{modalCancelar.clienteNome}</strong>?
            </span>
            <div className="flex gap-5 mt-2">
              <button
                className="px-7 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 transition cursor-pointer"
                onClick={confirmarCancelamento}
              >
                Sim
              </button>
              <button
                className="px-7 py-2 bg-gray-50 border border-gray-300 text-gray-600 rounded-lg font-bold shadow hover:bg-gray-100 transition cursor-pointer"
                onClick={() => setModalCancelar(null)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-8 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{popup}</span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setPopup(false)}
            >Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}