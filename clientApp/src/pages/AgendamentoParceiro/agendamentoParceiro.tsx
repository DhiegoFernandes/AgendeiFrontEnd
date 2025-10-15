import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const horariosMock: Record<string, Array<{
  id: number,
  cliente: string,
  servico: string,
  hora: string,
}>> = {
  // YYYY-MM-DD : [ ... ]
  "2025-10-10": [
    { id: 1, cliente: "João Silva", servico: "Corte de Cabelo Simples", hora: "09:00" },
    { id: 2, cliente: "Pedro Oliveira", servico: "Barba", hora: "11:30" },
    { id: 3, cliente: "Carlos Mendes", servico: "Corte Degradê", hora: "14:00" },
    { id: 4, cliente: "Lucas Ferreira", servico: "Corte + Barba", hora: "16:30" },
  ],
  "2025-10-11": [
    { id: 1, cliente: "Bruna Lima", servico: "Corte Feminino", hora: "09:00" },
  ],
  // adicione mais casos se quiser testar
};

function getAgendamentos(date: Date) {
  const iso = format(date, "yyyy-MM-dd");
  return horariosMock[iso] || [];
}

export default function AgendaPrestador() {
  const [data, setData] = useState<Date>(new Date("2025-10-10"));
  const agendamentos = getAgendamentos(data);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-16">
      {/* Header */}
      <header className="w-full flex justify-center mt-6 mb-10">
        <div className="max-w-3xl w-full flex items-center bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl px-3 md:px-9 py-4 shadow">
          <button
            title="Voltar ao perfil"
            className="mr-2 text-white/400 hover:text-gray-300 flex items-center cursor-pointer"
            onClick={() => navigate("/perfilParceiro")}
          >
            <HiOutlineArrowLeft size={24} />
            <span className="ml-1 hidden md:inline">Voltar ao perfil</span>
          </button>
          <h1 className="mx-auto text-xl md:text-2xl font-bold text-center tracking-wide w-full">
            Minha Agenda
          </h1>
          <span className="w-12" /> {/* Só para balancear */}
        </div>
      </header>

      {/* Main grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-2 z-0">
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
            {agendamentos.length ? agendamentos.map((ag, idx) => (
              <div
                key={ag.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between rounded-xl border border-gray-100 py-4 px-5 bg-purple-50/20 shadow-sm transition hover:bg-purple-50"
              >
                {/* Info */}
                <div className="flex-1 flex flex-col justify-center gap-0.5">
                  <div className="flex items-center gap-3">
                    <AiOutlineUser className="text-purple-600" size={22} />
                    <span className="font-extrabold text-lg text-gray-800">{ag.cliente}</span>
                  </div>
                  <span className="text-gray-500 font-semibold ml-8 mt-0.5">{ag.servico}</span>
                </div>
                {/* Hora e ações */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0">
                  <span className="rounded-xl px-4 py-2 font-bold bg-gradient-to-r from-purple-50 to-white text-purple-600 text-base shadow border border-purple-100 select-none min-w-[72px] text-center">
                    {ag.hora}
                  </span>
                  <div className="flex gap-2 mt-0">
                    <button
                      className="px-4 py-2 w-[90px] rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
                      title="Atualizar"
                      onClick={() => alert("Atualizar agendamento em breve!")}
                    >
                      Atualizar
                    </button>
                    <button
                      className="px-4 py-2 w-[90px] rounded-lg bg-red-500 text-white font-bold shadow hover:bg-red-600 transition cursor-pointer"
                      title="Cancelar"
                      onClick={() => alert("Cancelar agendamento em breve!")}
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
    </div>
  );
}