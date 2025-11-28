import { useState, useEffect, useCallback } from "react";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import CarrosselFotos from "../../components/CarrosselFotos";
import ClientNavbar from "../../components/ClientNavbar";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const categorias = [
  { nome: "Todos", tag: "todos" },
  { nome: "Beleza", tag: "BELEZA" },
  { nome: "Estética", tag: "ESTETICA" },
  { nome: "Barbearia", tag: "BARBEARIA" },
  { nome: "Maquiagem", tag: "MAQUIAGEM" },
  { nome: "Manicure", tag: "MANICURE" },
  { nome: "Outros", tag: "OUTROS" }
];

interface Negocio {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  cep: string;
  notaMedia: number;
  distanciaKm: number;
  categoria: string;
}

interface NegocioFormatado {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  cep: string;
  rating: number | null;
  distancia: string;
  categoria: string;
}

export default function Comercios() {
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const [notaMinima, setNotaMinima] = useState<number | null>(null);
  const [negocios, setNegocios] = useState<NegocioFormatado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para carregar negócios da API
  const carregarNegocios = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token de autenticação não encontrado!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/negocios/busca-negocios', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Transformar dados da API para o formato local
      const negociosFormatados: NegocioFormatado[] = response.data.map((negocio: Negocio) => ({
        id: negocio.id,
        nome: negocio.nome,
        endereco: negocio.endereco,
        numero: negocio.numero || "",
        cep: negocio.cep,
        rating: negocio.notaMedia || null,
        distancia: `${negocio.distanciaKm.toFixed(1)} km`,
        categoria: negocio.categoria,
      }));


      setNegocios(negociosFormatados);
    } catch (error) {
      console.error('Erro ao carregar negócios:', error);
      setError("Erro ao carregar negócios. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [notaMinima]);

  // Carregar negócios quando nota mínima mudar
  useEffect(() => {
    carregarNegocios();
  }, [carregarNegocios]);

  const filtrar = () =>
    negocios.filter(c => {
      const matchCat =
        cat === "todos" || c.categoria === cat;
      const matchQ =
        !q ||
        c.nome.toLowerCase().includes(q.toLowerCase()) ||
        c.endereco.toLowerCase().includes(q.toLowerCase()) ||
        c.categoria.toLowerCase().includes(q.toLowerCase());
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
              type="text"
              placeholder="Buscar salões, barbearias..."
              className="w-full py-2 pl-4 pr-20 rounded-full border border-gray-300 bg-gray-100 text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-200 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {/* Botão de limpar pesquisa (X) */}
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition cursor-pointer"
                aria-label="Limpar pesquisa"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {/* Ícone de lupa */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-purple-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="2" />                <path d="M21 21l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
        {/* Ícones e Perfil */}
  <div className="flex items-center gap-4 mt-1 md:mt-0">
  <button 
    onClick={() => navigate("/cliente/agendamento")}
    className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-700 transition cursor-pointer flex items-center gap-2"
  >
    <FaCalendarAlt />
    Meus Agendamentos
  </button>

  <button 
    onClick={() => navigate("/cliente/perfil")}
    className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-700 transition cursor-pointer flex items-center gap-2"
  >
    <FaUser />
    Meu Perfil
  </button>
</div>
      </header>
      {/* Categorias e Filtro de Avaliação */}
      <nav className="w-full overflow-x-auto bg-white border-b border-b-gray-100 ">
        <div className="flex gap-2 py-4 px-6 items-center">
          {/* Categorias */}
          {categorias.map(c => (
            <button
              key={c.tag}
              className={`
                px-5 py-2 rounded-full font-semibold cursor-pointer whitespace-nowrap
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
          {/* Filtro de Avaliação */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label className="text-sm font-semibold text-gray-700">
              Nota mínima:
            </label>
            <select
              value={notaMinima || ""}
              onChange={(e) => setNotaMinima(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-purple-600 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
            >
              <option value="">Todas</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>
            {notaMinima && (
              <button
                onClick={() => setNotaMinima(null)}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium underline cursor-pointer ml-1"
                title="Limpar filtro"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Destaque */}
      <main className="container mx-auto max-w-7xl py-8 px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Negócios Disponíveis</h2>

        {loading && (
          <div className="text-center text-purple-600 text-lg my-10">
            Carregando negócios...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 text-lg my-10">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtrar().map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
              {/* Banner Foto - Carrossel */}
              <CarrosselFotos negocioId={c.id} />
              {/* Conteúdo */}
              <div className="flex-1 flex flex-col gap-2 px-5 pt-3 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{c.nome}</h3>
                  <div className="flex items-center gap-1 font-semibold text-yellow-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1.5l2.59 6.85h7.2l-5.8 4.22L16.12 19 10 14.88 3.88 19l1.13-6.43-5.8-4.22h7.2z"/></svg>
                    <span className="text-gray-800 ml-1">{c.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-base leading-tight">{c.categoria}</p>
                <p className="text-gray-400 text-sm">{c.distancia} · {c.endereco}</p>
                <div className="flex flex-wrap gap-2 my-1">
                </div>
                <div className="mt-auto flex justify-end">
                  <button className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-purple-700 transition cursor-pointer"
                  onClick={() => navigate("/cliente/escolher-servico", { state: { negocioId: c.id } })}>
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
            {filtrar().length === 0 && (
              <div className="col-span-full text-center text-gray-400 mt-8">
                Nenhum negócio encontrado.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}