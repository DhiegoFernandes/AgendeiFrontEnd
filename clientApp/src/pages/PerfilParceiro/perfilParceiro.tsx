import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineStar, HiOutlineClock, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineCog
} from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { FaRegHandshake } from "react-icons/fa6";
import { PiScissorsDuotone } from "react-icons/pi";
import { FaChartColumn } from "react-icons/fa6";
import { BsFillPersonLinesFill } from "react-icons/bs";

function getInitials(name: string) {
  const n = name.split(" ");
  return n.length > 1 ? (n[0][0] + n[n.length - 1][0]).toUpperCase() : n[0][0].toUpperCase();
}

const adminKPIS = [
  { label: "Hoje", value: 8, subtitle: "Agendamentos", icon: <HiOutlineCalendar size={26} className="text-purple-500" /> },
  { label: "Pendentes", value: 3, subtitle: "Agendamentos", icon: <HiOutlineClock size={26} className="text-yellow-400" /> },
  { label: "Este mês", value: 42, subtitle: "Concluídos", icon: <HiOutlineTrendingUp size={26} className="text-green-500" /> },
];

export default function PerfilPrestador() {
  const navigate = useNavigate();

  const barbearia = "Barbearia Estilo";
  const profissional = "Ricardo Almeida";
  const funcao = "Barbeiro";
  const rating = 4.9;

  // Modal convidar parceiro
  const [modalConvite, setModalConvite] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [convitePopup, setConvitePopup] = useState<string | false>(false);

  function handleClickConvidar() {
    setModalConvite(true);
    setEmailConvite("");
  }

  function handleEnviarConvite(e: React.FormEvent) {
    e.preventDefault();
    if (!emailConvite.match(/^[\w-.]+@[\w-.]+\.[a-zA-Z]{2,}$/)) {
      setConvitePopup("E-mail inválido!");
      return;
    }
    setModalConvite(false);
    setConvitePopup("Convite enviado!");
    setEmailConvite("");
  }

  const shortcuts = [
    {
      label: "Agendamentos",
      desc: "Gerencie sua agenda",
      icon: <HiOutlineCalendar size={28} className="text-purple-500" />,
      highlight: 25,
      onClick: () => navigate("/agendamentoParceiro"),
    },
    {
      label: "Relatórios",
      desc: "Análise de desempenho",
      icon: <FaChartColumn size={26} className="text-blue-500" />,
      onClick: () => navigate("/relatorioParceiro"),
    },
    {
      label: "Serviços",
      desc: "Cadastre e edite",
      icon: <PiScissorsDuotone size={26} className="text-pink-500" />,
      onClick: () => navigate("/servicosParceiro"),
    },
    {
      label: "Configurações",
      desc: "Dados de Perfil",
      icon: <HiOutlineCog size={26} className="text-gray-500" />,
      onClick: () => navigate("/dadosParceiro"),
    },
    {
      label: "Convidar parceiro",
      desc: "Gerencie convites",
      icon: <FaRegHandshake size={24} className="text-yellow-500" />,
      onClick: handleClickConvidar,
    },
    {
      label: "Avaliações",
      desc: "Veja as avaliações",
      icon: <AiFillStar size={26} className="text-yellow-400" />,
      onClick: () => navigate("/avaliacoesParceiro"),
    },
    {
      label: "Gerenciar negócio", // <-- ALTERADO
      desc: "Gerencie seu negócio", // <-- ALTERADO
      icon: <BsFillPersonLinesFill size={24} className="text-purple-400" />,
      onClick: () => navigate("/gerenciarNegocio"), // <-- ALTERADO
    },
  ];

  return (
    <div className="bg-[#f6f5fb] min-h-screen">
      {/* Hero/Header */}
      <header className="w-full bg-gradient-to-br from-purple-600 to-purple-400 shadow-md relative px-4 py-8 rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <h1 className="text-white font-extrabold text-3xl sm:text-4xl mb-2 drop-shadow-lg">{barbearia}</h1>
            <div className="flex items-center gap-5 mt-2">
              <div className="w-14 h-14 rounded-full bg-white/25 text-2xl text-white font-extrabold flex items-center justify-center shadow ring-2 ring-white/20 select-none uppercase">
                {getInitials(profissional)}
              </div>
              <div>
                <span className="font-bold text-lg text-white">{profissional}</span>
                <span className="block text-white/80 text-sm">{funcao}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 mt-6 lg:mt-0">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl gap-2 backdrop-blur">
              <HiOutlineStar className="text-yellow-300" size={23} />
              <span className="font-bold text-lg text-white drop-shadow">{rating.toFixed(1)}</span>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-lg border-2 border-white text-white bg-white/10 hover:bg-white/20 font-semibold shadow transition cursor-pointer"
                onClick={() => navigate("/agendamentoParceiro")}
              >
                Abrir Agenda
              </button>
              <button className="px-5 py-2 rounded-lg border-2 border-white text-purple-900 bg-white/90 hover:bg-white font-semibold shadow transition cursor-pointer"
                onClick={() => navigate("/novo-agendamento")}
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 mt-10 px-2">
        {adminKPIS.map((kpi, idx) => (
          <article key={kpi.label} className="rounded-xl bg-white py-6 px-6 flex flex-col items-start shadow group hover:shadow-xl transition">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-600 text-base">{kpi.label}</span>{kpi.icon}
            </div>
            <div className="text-3xl font-extrabold text-purple-700 drop-shadow-xl animate-fadeIn">{kpi.value}</div>
            <div className="text-gray-400 text-xs">{kpi.subtitle}</div>
          </article>
        ))}
      </section>

      {/* Atalhos */}
      <section className="max-w-5xl mx-auto mt-12 px-2 mb-2">
        <div className="flex flex-col mb-6 px-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Gerenciar Negócio</h2>
          <p className="mt-1 text-gray-500">Atalhos para tudo que você usa no dia a dia</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortcuts.map(opt =>
            <button
              key={opt.label}
              className="relative bg-white rounded-2xl px-8 py-7 flex flex-col items-start gap-1 overflow-hidden shadow-lg hover:shadow-2xl transition group focus:outline-none cursor-pointer"
              onClick={opt.onClick}
              tabIndex={0}
              aria-label={opt.label}
            >
              <div className="flex items-center gap-3 mb-1">
                {opt.icon}
                <span className="text-lg font-extrabold text-gray-700 group-hover:text-purple-700 transition">{opt.label}</span>
                {opt.highlight &&
                  <span className="inline-flex ml-2 bg-red-500 text-white rounded-full px-2 h-6 items-center text-xs font-bold animate-bounce">{opt.highlight}</span>}
              </div>
              <span className="text-[15px] text-gray-500 font-medium">{opt.desc}</span>
            </button>
          )}
        </div>
      </section>

      {/* MODAL: Convidar parceiro */}
      {modalConvite && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <form
            className="bg-white max-w-sm w-full rounded-2xl shadow-2xl px-8 py-8 flex flex-col gap-5 items-center"
            onSubmit={handleEnviarConvite}
            autoComplete="off"
          >
            <input
              type="email"
              className="w-full rounded-lg border-2 border-purple-200 px-4 py-3 text-base shadow focus:ring-2 focus:ring-purple-400 outline-none font-semibold bg-white transition-colors"
              placeholder="E-mail do parceiro"
              value={emailConvite}
              onChange={e => setEmailConvite(e.target.value)}
              required
              autoFocus
            />
            <div className="flex gap-4 w-full mt-2">
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
              >
                Enviar convite
              </button>
              <button
                type="button"
                onClick={() => setModalConvite(false)}
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popup central para feedback */}
      {convitePopup && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{convitePopup}</span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setConvitePopup(false)}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}