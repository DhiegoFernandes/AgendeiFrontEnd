import { useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { FiUser, FiArrowLeft } from "react-icons/fi";
import Logo from "../../assets/LogoAgendei.png";
import { useNavigate } from "react-router-dom";

type Review = {
  nome: string
  data: string
  servico: string
  comentario: string
  nota: number
}

const AVALIACOES_MOCK: Review[] = [
  { nome: "Marina Alves", data: "12/06/2024", servico: "Sobrancelha", comentario: "Amei o resultado, super indico!", nota: 5 },
  { nome: "Leonardo S.", data: "07/07/2024", servico: "Corte masculino", comentario: "Atendimento ótimo, corte no tempo.", nota: 4 },
  { nome: "Juliana Souza", data: "29/05/2024", servico: "Luzes", comentario: "Profissionais incríveis, amei as luzes!", nota: 5 },
  { nome: "Carlos M.", data: "10/04/2024", servico: "Barba", comentario: "Poderia caprichar mais no acabamento, mas foi bom.", nota: 3 },
  { nome: "Anderson Lopes", data: "18/07/2024", servico: "Corte masculino", comentario: "Top, Zé é fera!", nota: 4 },
  { nome: "Camila F.", data: "02/06/2024", servico: "Limpeza de pele", comentario: "Atendimento maravilhoso. Recomendo.", nota: 5 },
  { nome: "Patricia Lemos", data: "05/07/2024", servico: "Escova", comentario: "Não gostei do resultado, escova saiu rápido.", nota: 2 },
  { nome: "Bruno Dias", data: "09/07/2024", servico: "Penteado", comentario: "Equipe nota 10. Ficou lindo!", nota: 5 },
  { nome: "Amanda Reis", data: "17/05/2024", servico: "Tratamento Capilar", comentario: "Fiquei muito satisfeita.", nota: 4 },
  { nome: "Paulo Silva", data: "03/05/2024", servico: "Corte", comentario: "Serviço bom, ambiente agradável.", nota: 3 }
];

const STAR_FILTERS = [
  { label: "Todos", val: "all" },
  { label: "5★", val: "5" },
  { label: "4★", val: "4" },
  { label: "3★", val: "3" },
  { label: "2★", val: "2" },
  { label: "1★", val: "1" },
];

function getInitials(nome: string) {
  const arr = nome.trim().split(" ");
  return arr.slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export default function AvaliacoesComercio() {
  const [filtro, setFiltro] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");
  const navigate = useNavigate();

  const avaliacoesFiltradas = useMemo(() => {
    if (filtro === "all") return AVALIACOES_MOCK;
    return AVALIACOES_MOCK.filter(a => a.nota === parseInt(filtro));
  }, [filtro]);

  const { media, breakdown } = useMemo(() => {
    const notas = avaliacoesFiltradas.map(a => a.nota);
    const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    avaliacoesFiltradas.forEach(a => { breakdown[a.nota]++; });
    return { media, breakdown };
  }, [avaliacoesFiltradas]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      {/* Header/Hero */}
      <header className="w-full bg-white from-purple-600 to-purple-500 py-5 flex flex-col items-center rounded-b-2xl shadow mb-8 relative">
        <button
          className="absolute left-5 top-7 flex items-center text-purple-700 font-bold gap-1 hover:text-purple-500 transition cursor-pointer"
          onClick={() => navigate("/perfilParceiro")}
        >
          <FiArrowLeft size={22}/> <span className="hidden sm:inline text-base">Voltar ao perfil</span>
        </button>
        <img src={Logo} alt="logo" className="mb-2 w-24 rounded-xl shadow-lg mt-2" />
        <h1 className="font-extrabold text-3xl text-purple-700 drop-shadow tracking-wide">Avaliações</h1>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-[320px,1fr] gap-8 px-2">
        {/* Card summary & breakdown */}
        <section className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl font-black text-purple-700">{media.toFixed(1)}</span>
            <div className="flex mt-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={22}
                  className={i < Math.round(media) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm mb-2">{avaliacoesFiltradas.length} avaliação{avaliacoesFiltradas.length !== 1 && "s"}</span>
          </div>
          <div className="w-full mt-5 flex flex-col gap-1">
            {([5, 4, 3, 2, 1] as const).map(star => {
              const pct = Math.round((breakdown[star] / (avaliacoesFiltradas.length || 1)) * 100);
              return (
                <div key={star} className="flex items-center gap-2 px-1">
                  <span className="text-gray-500 text-base w-8">{star} ★</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full relative">
                    <span className="absolute h-2 left-0 top-0 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg,#7c4eff,#5b39c2)",
                        transition: "width .5s"
                      }} />
                  </div>
                  <span className="w-8 text-gray-400 text-xs font-bold text-right">{breakdown[star]}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lista de avaliações */}
        <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
          {/* Filtros */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {STAR_FILTERS.map(f => (
              <button
                key={f.val}
                className={
                  "px-5 py-1.5 text-base rounded-full font-bold transition " +
                  (filtro === f.val
                    ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow"
                    : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50")
                }
                onClick={() => setFiltro(f.val as any)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-6">
            {avaliacoesFiltradas.length === 0 && (
              <li className="text-gray-400 mt-7 text-lg font-medium text-center">Nenhuma avaliação encontrada.</li>
            )}

            {avaliacoesFiltradas.map((a, i) => (
              <li key={i} className="flex items-start gap-5 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 shadow transition">
                <div className="flex flex-col items-center mt-1">
                  <span className="w-11 h-11 rounded-full bg-purple-400 text-white flex items-center justify-center font-bold text-lg shadow text-center select-none">
                    {getInitials(a.nome)}
                  </span>
                  <div className="flex mt-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar
                        key={idx}
                        size={16}
                        className={idx < a.nota ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className="font-bold text-gray-900 text-base">{a.nome}</span>
                    <span className="text-gray-400 text-xs">{a.data}</span>
                  </div>
                  <span className="inline-block text-sm text-purple-600 font-bold bg-purple-100 px-3 py-0.5 rounded-full">{a.servico}</span>
                  <div className="text-base text-gray-800 mt-2 break-words leading-snug">{a.comentario}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}