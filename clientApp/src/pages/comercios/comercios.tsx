import { useState } from "react";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import salaoUm from "../../assets/salaoUm.png";
import salaoDois from "../../assets/salaoDois.png"
import salaoTres from "../../assets/salaoTres.png"
import { useNavigate } from "react-router-dom";

// Mock dos comércios (pode puxar de API)
const commercesDemo = [
  {
    id: 1,
    nome: "Studio Beauty & Hair",
    destaque: "Premium",
    img: salaoUm,
    rating: 4.9,
    tags: ["Cabeleireiro", "Manicure", "Estética"],
    distancia: "23 km",
    bairro: "Centro",
    status: { texto: "Disponível hoje", cor: "green" }
  },
  {
    id: 2,
    nome: "Barbearia Vintage",
    destaque: "Destaque",
    img: salaoDois,
    rating: 4.2,
    tags: ["Barbearia", "Corte Masculino"],
    distancia: "15 km",
    bairro: "Jardins",
    status: { texto: "Disponível hoje", cor: "green" }
  },
  {
    id: 3,
    nome: "Espaço Beleza Total",
    destaque: "Popular",
    img: salaoTres,
    rating: 4.7,
    tags: ["Manicure", "Pedicure", "Estética"],
    distancia: "31 km",
    bairro: "Vila Nova",
    status: { texto: "Poucos horários", cor: "yellow" }
  }
];

const categorias = [
  { nome: "Todos", tag: "todos" },
  { nome: "Cabeleireiros", tag: "cabeleireiro" },
  { nome: "Barbearias", tag: "barbearia" },
  { nome: "Manicure", tag: "manicure" },
  { nome: "Estética", tag: "estética" }
];

export default function Comercios() {
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const filtrar = () =>
    commercesDemo.filter(c => {
      const matchCat =
        cat === "todos" || c.tags.map(t => t.toLowerCase()).includes(cat);
      const matchQ =
        !q ||
        c.nome.toLowerCase().includes(q.toLowerCase()) ||
        c.tags.join(" ").toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });

  return (
    <div className="min-h-screen bg-[#f6f5fb]">
      {/* Header + Toolbar */}
      <header className="bg-white shadow-sm px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center justify-between sticky top-0 z-20">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={LogoAgendeiHori} alt="Logo agendei" className="w-40" />
        </div>
        {/* SEARCH */}
        <div className="flex-1 flex justify-center mx-0">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              placeholder="Buscar salões, barbearias..."
              className="w-full py-2 pl-4 pr-12 rounded-full border border-gray-300 bg-gray-100 text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-purple-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
        {/* Ícones e Perfil */}
        <div className="flex items-center gap-4 mt-1 md:mt-0">
          <button onClick={() => navigate("/cliente/perfil")}
          className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-700 transition cursor-pointer">Perfil</button>
          <span className="text-2xl cursor-pointer text-purple-500">🔔</span>
          <div className="w-9 h-9 flex items-center justify-center bg-purple-400 text-white font-bold rounded-full shadow text-lg">MS</div>
        </div>
      </header>
      {/* Categorias */}
      <nav className="w-full overflow-x-auto bg-white border-b border-b-gray-100 ">
        <div className="flex gap-2 py-4 px-6 min-w-full max-w-full">
          {categorias.map(c => (
            <button
              key={c.tag}
              className={`
                px-5 py-2 rounded-full font-semibold cursor-pointer
                ${cat === c.tag
                  ? "bg-purple-600 text-white shadow"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100 cursor-pointer"}
                transition
              `}
              onClick={() => setCat(c.tag)}
            >
              {c.nome}
            </button>
          ))}
        </div>
      </nav>
      {/* Destaque */}
      <main className="container mx-auto max-w-7xl py-8 px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Em Destaque</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtrar().map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
              {/* Banner Foto */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={c.img}
                  alt={c.nome}
                  className="w-full h-full object-cover"
                />
                {/* <span className={`
                  absolute left-3 top-3 px-4 py-1 rounded-full text-xs font-extrabold
                  ${c.destaque === "Premium"
                    ? "bg-red-500 text-white"
                    : c.destaque === "Destaque"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-900 text-white"}
                  shadow-sm
                `}>
                  {c.destaque}
                </span> */}
              </div>
              {/* Conteúdo */}
              <div className="flex-1 flex flex-col gap-2 px-5 pt-3 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{c.nome}</h3>
                  <div className="flex items-center gap-1 font-semibold text-yellow-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1.5l2.59 6.85h7.2l-5.8 4.22L16.12 19 10 14.88 3.88 19l1.13-6.43-5.8-4.22h7.2z"/></svg>
                    <span className="text-gray-800 ml-1">{c.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-base leading-tight">{c.tags.join(" · ")}</p>
                <p className="text-gray-400 text-sm">{c.distancia} · {c.bairro}</p>
                <div className="flex flex-wrap gap-2 my-1">
                  <span className={`
                    rounded-full px-4 py-1 text-sm font-semibold border
                    ${c.status.cor === "green"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-800 border-yellow-300"}
                  `}>
                    {c.status.texto}
                  </span>
                </div>
                <div className="mt-auto flex justify-end">
                  <button className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-purple-700 transition cursor-pointer"
                  onClick={() => navigate("/cliente/agendar-horario")}>
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtrar().length === 0 && (
            <div className="col-span-full text-center text-gray-400 mt-8">
              Nenhum comércio encontrado.
            </div>
          )}
        </div>
      </main>
 </div>
);
}