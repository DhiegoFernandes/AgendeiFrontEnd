import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiOutlineClock, HiOutlineCheck } from "react-icons/hi";
import LogoAgendei from "../../assets/AgendeiHorizontal.png";

/* Dias utilitários */
const NOMES_DIAS = [
  { nome: "Domingo", abreviacao: "D" },
  { nome: "Segunda-feira", abreviacao: "S" },
  { nome: "Terça-feira", abreviacao: "T" },
  { nome: "Quarta-feira", abreviacao: "Q" },
  { nome: "Quinta-feira", abreviacao: "Q" },
  { nome: "Sexta-feira", abreviacao: "S" },
  { nome: "Sábado", abreviacao: "S" },
];

type DisponibilidadeDia = {
  nome: string,
  abreviacao: string,
  inicio: string,
  fim: string,
  ativo: boolean
};

/* Mock, troque pelo fetch da sua API */
const DISPONIBILIDADE_INICIAL: DisponibilidadeDia[] = NOMES_DIAS.map(dia => ({
  nome: dia.nome,
  abreviacao: dia.abreviacao,
  inicio: "09:00",
  fim: "18:00",
  ativo: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira"].includes(dia.nome),
}));

export default function DisponibilidadePrestador() {
  // Pode puxar da API no useEffect
  const [dias, setDias] = useState<DisponibilidadeDia[]>(DISPONIBILIDADE_INICIAL);
  const [popup, setPopup] = useState(false);
  // Exemplo fetch (useEffect)
  useEffect(() => {
    // fetch("/api/disponibilidade").then(r => r.json()).then(setDias)
  }, []);

  function handleToggle(idx: number) {
    setDias(list => list.map((d, i) =>
      i === idx ? { ...d, ativo: !d.ativo } : d
    ));
  }
  
  function handleHora(idx: number, campo: "inicio" | "fim", value: string) {
    setDias(list => list.map((d, i) =>
      i === idx ? { ...d, [campo]: value } : d
    ));
  }

  function handleAtualizar(e: React.FormEvent) {
    e.preventDefault();
    // Aqui envie para API: await fetch("/api/disponibilidade", { method: "PUT", body: JSON.stringify(dias) })
    setPopup(true);
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header logo */}
      <header className="w-full bg-white px-5 py-4 shadow flex items-center justify-between rounded-b-2xl mb-6 max-w-4xl mx-auto">
        <img src={LogoAgendei} alt="Agendei" className="w-32 sm:w-38 select-none" />
        <span className="text-purple-600 bg-purple-100 rounded-full p-2">
          <FiUser size={24} />
        </span>
      </header>
      
      <div className="max-w-3xl w-full flex flex-col items-center">
        <section className="w-full flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Atualizar Disponibilidade</h2>
          <p className="text-gray-500 text-base text-center">Defina seus horários de trabalho para cada dia da semana</p>
        </section>

        <form
          onSubmit={handleAtualizar}
          className="w-full"
        >
          <section className="availability w-full bg-white rounded-xl shadow px-2 sm:px-6 py-8 flex flex-col gap-4 mb-10">
            {dias.map((dia, idx) => (
              <div key={dia.nome} className="day flex items-center justify-between bg-[#f9f9f9] rounded-xl py-4 px-4 mb-1 shadow-sm gap-4 flex-wrap transition hover:translate-x-1">
                <div className="flex items-center min-w-[165px] mr-5">
                  <span className="day-icon bg-purple-600 text-white w-9 h-9 rounded-full text-lg font-bold shadow flex items-center justify-center mr-3 select-none">{dia.abreviacao}</span>
                  <span className="text-lg font-extrabold text-gray-800">{dia.nome}</span>
                </div>
                <div className="time-select flex flex-col md:flex-row gap-1 md:gap-4 flex-1 min-w-[180px]">
                  <label className="font-semibold text-sm text-gray-700">
                    Início
                    <span className="flex items-center gap-1">
                      <input
                        type="time"
                        value={dia.inicio}
                        disabled={!dia.ativo}
                        onChange={e => handleHora(idx, "inicio", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-28 focus:ring-2 focus:ring-purple-400 outline-none bg-white mx-1 disabled:bg-gray-100"
                        required={dia.ativo}
                        min="05:00"
                        max="23:00"
                      />
                      <HiOutlineClock className="text-gray-400" />
                    </span>
                  </label>
                  <label className="font-semibold text-sm text-gray-700">
                    Fim
                    <span className="flex items-center gap-1">
                      <input
                        type="time"
                        value={dia.fim}
                        disabled={!dia.ativo}
                        onChange={e => handleHora(idx, "fim", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm w-28 focus:ring-2 focus:ring-purple-400 outline-none bg-white mx-1 disabled:bg-gray-100"
                        required={dia.ativo}
                        min="05:00"
                        max="23:59"
                      />
                      <HiOutlineClock className="text-gray-400" />
                    </span>
                  </label>
                </div>
                {/* Toggle */}
                <button
                  tabIndex={0}
                  type="button"
                  aria-pressed={dia.ativo}
                  aria-label="Ativar ou desativar dia"
                  className={`w-16 h-8 bg-gray-200 transition rounded-full border-2 relative ml-auto focus:outline-none cursor-pointer
                    ${dia.ativo ? "bg-purple-500 border-purple-400" : "border-gray-200"}`}
                  style={{ borderColor: dia.ativo ? "#a855f7" : "#e5e7eb" }}
                  onClick={() => handleToggle(idx)}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform cursor-pointer
                      ${dia.ativo ? "transform translate-x-5" : ""}`}
                    style={{
                      transform: dia.ativo ? "translateX(13px)" : "none",
                      transition: "transform 0.5s"
                    }}
                  />
                </button>
              </div>
            ))}
          </section>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold text-lg shadow hover:brightness-110 transition cursor-pointer"
          >
            Atualizar
          </button>
        </form>
      </div>
      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-10 py-8 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <HiOutlineCheck size={38} className="text-green-500 mb-3" />
            <span className="text-lg font-bold text-purple-700 mb-2 text-center">
              Disponibilidade atualizada!
            </span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setPopup(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}