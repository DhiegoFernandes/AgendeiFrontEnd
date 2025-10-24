import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

// Exemplo de interface para agendamento
interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  hora: string;
}

// Exemplo: interface para horário disponível (por serviço)
interface HorariosPorServico {
  [servico: string]: string[];
}

export default function AgendaPrestador() {
  const [data, setData] = useState<Date>(new Date()); // Data escolhida no calendário
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modalEdit, setModalEdit] = useState<{
    id: number,
    servico: string,
    index: number,
    date: Date,
    hora: string
  } | null>(null);
  const [popup, setPopup] = useState<false | string>(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorariosPorServico>({});

  const navigate = useNavigate();

  // --- BUSCAR AGENDAMENTOS DO DIA SELECIONADO ---
  useEffect(() => {
    // =======================
    // AQUI: Busque na sua API os agendamentos do dia
    // Exemplo:
    // fetch(`/api/agendamentos?date=${format(data, "yyyy-MM-dd")}`)
    //   .then(resp => resp.json())
    //   .then((lista: Agendamento[]) => setAgendamentos(lista));
    // =======================
    setAgendamentos([]); // Remova esta linha quando usar API real
  }, [data]);

  // --- BUSCAR HORÁRIOS DISPONÍVEIS POR SERVIÇO ---
  useEffect(() => {
    // =======================
    // AQUI: Busque horários disponíveis por serviço da sua API
    // Exemplo:
    // fetch("/api/horariosDisponiveis")
    //   .then(resp => resp.json())
    //   .then((obj: HorariosPorServico) => setHorariosDisponiveis(obj));
    // =======================
    setHorariosDisponiveis({}); // Remova esta linha quando usar API real
  }, []);

  function handleEditar(ag: Agendamento, idx: number) {
    setModalEdit({
      id: ag.id,
      index: idx,
      date: data,
      hora: ag.hora,
      servico: ag.servico
    });
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (modalEdit) {
      // =======================
      // AQUI: Envie atualização via API (PUT/PATCH) para id = modalEdit.id
      // Por exemplo:
      // await fetch(`/api/agendamentos/${modalEdit.id}`, {... dados ...});
      // Após sucesso, refaça o fetch dos agendamentos do dia: veja o useEffect acima.
      // =======================
      setPopup("Agendamento atualizado com sucesso!");
      setModalEdit(null);
    }
  }

  // Retorna horários permitidos conforme serviço selecionado
  function horasParaServico(servico: string) {
    // =======================
    // AQUI: horáriosDisponiveis[servico] vindo da sua API
    // Exemplo de retorno: ["09:00", "10:00", "12:00", "15:00"]
    // =======================
    return horariosDisponiveis[servico] || [];
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
              {agendamentos.length} agendamento{agendamentos.length !== 1 && "s"}
            </span>
          </div>
          <div className="flex flex-col gap-4 mt-1">
            {/* Renderize seus agendamentos aqui */}
            {agendamentos.length ? agendamentos.map((ag, idx) => (
              <div
                key={ag.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between rounded-xl border border-gray-100 py-4 px-5 bg-purple-50/20 shadow-sm transition hover:bg-purple-50"
              >
                <div className="flex-1 flex flex-col justify-center gap-0.5">
                  <div className="flex items-center gap-3">
                    <AiOutlineUser className="text-purple-600" size={22} />
                    <span className="font-extrabold text-lg text-gray-800">{ag.cliente}</span>
                  </div>
                  <span className="text-gray-500 font-semibold ml-8 mt-0.5">{ag.servico}</span>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0">
                  <span className="rounded-xl px-4 py-2 font-bold bg-gradient-to-r from-purple-50 to-white text-purple-600 text-base shadow border border-purple-100 select-none min-w-[72px] text-center">
                    {ag.hora}
                  </span>
                  <div className="flex gap-2 mt-0">
                    <button
                      className="px-4 py-2 w-[90px] rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
                      title="Atualizar"
                      onClick={() => handleEditar(ag, idx)}
                    >
                      Atualizar
                    </button>
                    <button
                      className="px-4 py-2 w-[90px] rounded-lg bg-red-500 text-white font-bold shadow hover:bg-red-600 transition cursor-pointer"
                      title="Cancelar"
                      onClick={() => {/* Sua ação para cancelar aqui */}}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )) : (
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
                {/* Puxe os horários disponíveis do serviço pelo backend */}
                {(horariosDisponiveis[modalEdit.servico] || []).map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
              <span className="text-sm text-gray-400 mt-1 block">Serviço: {modalEdit.servico}</span>
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