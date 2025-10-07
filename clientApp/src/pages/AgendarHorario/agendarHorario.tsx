import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import salaoDois from "../../assets/salaoDois.png"

const profissional = {
  nome: "Ricardo Almeida",
  nota: 4.8,
  funcao: "Cabeleireiro",
  salao: "Salão Beleza Total",
  servico: "Corte Masculino",
  preco: 45,
  duracao: 30,
};

export default function AgendarHorario() {
  const navigate = useNavigate();
  const [data, setData] = useState<Date>(new Date());
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState<string | null>(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [erroHorarios, setErroHorarios] = useState<string | null>(null);

  // Fetch horários sempre que a data muda
  useEffect(() => {
    async function fetchHorarios() {
      setLoadingHorarios(true);
      setErroHorarios(null);
      setHora(null);

      // Domingo: fecha
      if (data.getDay() === 0) {
        setHorarios([]);
        setLoadingHorarios(false);
        return;
      }

      try {
        const iso = formatISO(data, { representation: "date" }); // "YYYY-MM-DD"
        // Altere a URL para sua API real!
        const resp = await fetch(`/api/horarios?data=${iso}`);
        if (!resp.ok) throw new Error("Erro carregando horários");
        const lista: string[] = await resp.json();
        setHorarios(lista);
      } catch (e) {
        setHorarios([]);
        setErroHorarios("Não foi possível carregar horários.");
      }
      setLoadingHorarios(false);
    }
    fetchHorarios();
  }, [data]);

  function handleAgendar() {
    alert(
      `Agendamento confirmado!\n\nProfissional: ${profissional.nome}\nServiço: ${profissional.servico}\nData: ${format(data, "PPP", { locale: ptBR })}\nHorário: ${hora}\nValor: R$ ${profissional.preco.toFixed(2)}`
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-24">
      {/* TOPBAR GRADIENTE */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-4 px-8 flex items-center justify-between sticky top-0 z-20 shadow">
        <button onClick={() => navigate(-1)} className="mr-2 text-2xl text-white font-bold hover:opacity-80">
          &#8592;
        </button>
        <h2 className="text-white font-bold text-2xl text-center flex-1">Agendar Horário</h2>
        <button className="text-2xl text-white opacity-80 hover:opacity-100 transition">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect x="4" y="5" width="16" height="16" rx="4" fill="#fff" opacity=".3"/>
            <rect x="7" y="8" width="10" height="10" rx="2" fill="#fff"/>
          </svg>
        </button>
      </header>

      {/* CARD PROFISSIONAL */}
      <section className="max-w-2xl mx-auto mt-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow px-8 py-6 justify-between">
          <div className="flex items-center gap-6 w-full">
            <img
              src={salaoDois}
              alt=""
              className="w-20 h-20 object-cover rounded-xl border bg-gray-50"
            />
            <div className="flex flex-col flex-1">
              <h3 className="font-extrabold text-2xl text-gray-900">{profissional.nome}</h3>
              <p className="text-gray-600 flex items-center gap-2 font-semibold mt-1">
                <span className="text-yellow-500 text-lg">★ {profissional.nota}</span>
                {profissional.funcao} · {profissional.salao}
              </p>
              <p className="text-gray-700 mt-1">
                {profissional.servico} — R$ {profissional.preco.toFixed(2)} · {profissional.duracao} min
              </p>
            </div>
          </div>
          <button
            className="ml-0 md:ml-4 px-4 py-2 font-bold text-purple-600 border-2 border-purple-200 bg-white rounded-lg shadow hover:bg-purple-50 transition whitespace-nowrap mt-4 md:mt-0"
            onClick={() => navigate("/escolherservico")}
          >
            Trocar serviço
          </button>
        </div>

        {/* CARD CALENDÁRIO */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <label className="block font-bold text-lg mb-4">Selecione uma data</label>
          <DayPicker
            mode="single"
            selected={data}
            onSelect={d => d && setData(d)}
            locale={ptBR}
            weekStartsOn={0}
            fromDate={new Date()}
            modifiersClassNames={{
              selected: "bg-purple-500 text-white !rounded-lg",
              today: "text-purple-600 font-bold",
            }}
            className="w-full max-w-md"
            classNames={{
              head_row: "text-gray-500 font-bold",
            }}
          />
        </div>

        {/* CARD horários */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-3">
            <h3 className="font-bold text-xl text-gray-800">Horários disponíveis</h3>
            <span className="text-sm text-gray-400">
              {format(data, "PPPP", { locale: ptBR })}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {loadingHorarios && (
              <span className="col-span-full text-center text-purple-600 animate-pulse">Carregando horários...</span>
            )}
            {erroHorarios && (
              <span className="col-span-full text-center text-red-500">{erroHorarios}</span>
            )}
            {!loadingHorarios && !erroHorarios && horarios.length > 0 && horarios.map(hr => (
              <button
                key={hr}
                className={`py-2 px-3 rounded-xl text-base font-bold border-2 transition
                  ${hora === hr
                    ? "border-purple-500 bg-purple-50 text-purple-800"
                    : "border-gray-200 bg-white hover:bg-purple-100"}
                `}
                onClick={() => setHora(hr)}
              >
                {hr}
              </button>
            ))}
            {!loadingHorarios && !erroHorarios && horarios.length === 0 && (
              <span className="col-span-full text-center text-gray-500">Sem horários disponíveis</span>
            )}
          </div>
        </div>

        {/* CARD RESUMO */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <h3 className="font-extrabold text-xl mb-4">Resumo</h3>
          <div className="flex flex-col gap-2 text-base">
            <span>Serviço: <span className="font-extrabold">{profissional.servico}</span></span>
            <span>Profissional: <span className="font-extrabold">{profissional.nome}</span></span>
            <span>
              Data:{" "}
              <span className="font-extrabold">
                {format(data, "PPPP", { locale: ptBR })}
              </span>
            </span>
            <span>
              Horário:{" "}
              <span className="font-extrabold">
                {hora || "—"}
              </span>
            </span>
            <div className="flex justify-between mt-2 text-xl font-extrabold">
              <span className="text-purple-700">Valor total:</span>
              <span className="text-purple-700">
                R$ {profissional.preco.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Botão rodapé fixo */}
      <footer className="fixed left-0 right-0 bottom-0 flex justify-center z-30 bg-opacity-0 pointer-events-none">
        <button
          className={`pointer-events-auto w-full max-w-2xl bg-purple-600 h-14 text-white text-lg font-bold rounded-xl shadow-lg mb-4 mx-2
                      transition focus:ring-4 ring-purple-300
                      ${!hora ? "opacity-60 cursor-not-allowed" : "hover:bg-purple-700"}`}
          disabled={!hora}
          onClick={handleAgendar}
        >
          Confirmar Agendamento
        </button>
      </footer>
    </div>
  );
}