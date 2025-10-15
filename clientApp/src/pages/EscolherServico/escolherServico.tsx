import { useState } from "react";
import ComercioImg from "../../assets/salaoTres.png"; // ou outro path da sua imagem
import { FaCut } from "react-icons/fa";

const categorias = [
  { tag: "todos", nome: "Todos" },
  { tag: "cortes", nome: "Cortes" },
  { tag: "barbas", nome: "Barbas" },
  { tag: "tratamentos", nome: "Tratamentos" },
  { tag: "combos", nome: "Combos" },
];

const servicosDemo = [
  {
    nome: "Corte Masculino", desc: "Corte tradicional com tesoura e máquina", categoria: "cortes", tempo: "30 min", preco: 45,
  },
  {
    nome: "Corte Degradê", desc: "Transição suave entre diferentes comprimentos", categoria: "cortes", tempo: "40 min", preco: 55,
  },
  {
    nome: "Corte Navalhado", desc: "Acabamento com navalha para maior definição", categoria: "cortes", tempo: "45 min", preco: 60,
  },
  {
    nome: "Corte Infantil", desc: "Para crianças até 12 anos", categoria: "cortes", tempo: "25 min", preco: 35,
  },
  {
    nome: "Barba Completa", desc: "Aparar + modelar + toalha quente", categoria: "barbas", tempo: "25 min", preco: 35,
  },
  {
    nome: "Corte + Barba", desc: "Combo completo com acabamento", categoria: "combos", tempo: "60 min", preco: 70,
  },
];

// ENDEREÇO DO CABELEIREIRO DA SUA DEMO
const ENDERECO_DESTINO = "Av. Paulista, 1000, São Paulo";

export default function EscolherServico() {
  const [categoria, setCategoria] = useState("todos");
  const [servicoSel, setServicoSel] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [distancia, setDistancia] = useState<string | null>(null);
  const [duracao, setDuracao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const servicosFiltrados = servicosDemo.filter(
    s => categoria === "todos" || s.categoria === categoria
  );

  async function handleVerMapa() {
    setShowMap(true);
    setCarregando(true);
    setDistancia(null);
    setDuracao(null);
    setErro(null);

    if (!navigator.geolocation) {
      setErro("Geolocalização não suportada neste navegador.");
      setCarregando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const origem = `${position.coords.latitude},${position.coords.longitude}`;
        try {
          const apiKey = "AIzaSyDQHCfEBOf_EO6Abo4Q-n987llQhru87Rw"; // <<----- TROQUE PELA SUA CHAVE GOOGLE
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origem}&destinations=${encodeURIComponent(
            ENDERECO_DESTINO
          )}&key=${apiKey}&mode=driving`;

          // Usando proxy CORS apenas para desenvolvimento! Ideal backend para produção.
          const response = await fetch(
            `https://corsproxy.io/?${encodeURIComponent(url)}`
          );
          const data = await response.json();

          if (
            data.rows &&
            data.rows[0] &&
            data.rows[0].elements &&
            data.rows[0].elements[0].status === "OK"
          ) {
            setDistancia(data.rows[0].elements[0].distance.text);
            setDuracao(data.rows[0].elements[0].duration.text);
          } else {
            setErro("Não foi possível calcular a distância.");
          }
        } catch (e) {
          setErro("Erro ao consultar o Google Maps.");
        }
        setCarregando(false);
      },
      error => {
        setErro("Não foi possível obter sua localização.");
        setCarregando(false);
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-24">
      {/* Cabeçalho */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-purple-400 py-4 px-8 flex items-center justify-between sticky top-0 z-20 shadow">
        <h1 className="text-white font-bold text-xl">Escolher Serviços</h1>
        <button className="text-2xl text-white opacity-70 hover:opacity-100 transition" title="Calendário">
          <FaCut size={22} />
        </button>
      </header>

      {/* Card do barbeiro/comércio */}
      <section className="max-w-2xl mx-auto -mt-8">
        <div className="flex items-center bg-white rounded-2xl shadow-lg px-6 py-4 mt-8 gap-4 md:gap-6">
          <img src={ComercioImg} alt="Imagem do comercio" className="w-16 h-16 object-cover rounded-xl border shadow bg-gray-50" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Barbearia Estilo</h2>
            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500 font-medium">
              <span className="text-yellow-500 text-base">★ 4.9</span>
              <span className="opacity-70">· Av. Paulista, 1000 · 2.5 km</span>
            </div>
          </div>
          <button
            onClick={handleVerMapa}
            className="ml-auto px-4 py-2 font-semibold text-purple-600 border border-purple-300 rounded-lg shadow-sm hover:bg-purple-50 transition text-[16px] self-start"
          >
            Ver mapa
          </button>
        </div>
      </section>

      {/* Tabs de categorias */}
      <nav className="w-full bg-white border-t border-b border-gray-100 sticky top-[60px] z-10 mt-6 shadow">
        <div className="max-w-2xl mx-auto px-2 py-4 flex gap-2 overflow-x-auto">
          {categorias.map(cat => (
            <button
              key={cat.tag}
              onClick={() => setCategoria(cat.tag)}
              className={`px-5 py-2 font-bold rounded-full transition
                ${
                  categoria === cat.tag
                    ? "bg-purple-600 shadow text-white"
                    : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                }
              `}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </nav>

      {/* Lista de serviços */}
      <main className="max-w-2xl mx-auto py-8 px-3">
        <h3 className="text-xl font-bold mb-4">Serviços disponíveis</h3>
        <div className="flex flex-col gap-6">
          {servicosFiltrados.map((s, idx) => (
            <label
              key={idx}
              className={`flex items-center px-6 py-5 rounded-2xl shadow-sm bg-white cursor-pointer border-2 transition-all
                ${servicoSel === idx ? "border-purple-500 bg-purple-50" : "border-white hover:border-purple-300"}
              `}
            >
              <input
                type="radio"
                checked={servicoSel === idx}
                onChange={() => setServicoSel(idx)}
                className="sr-only"
                name="servico"
              />
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center">
                  <span className={`font-bold text-lg text-gray-900 ${servicoSel === idx ? "text-purple-700" : ""}`}>{s.nome}</span>
                </div>
                <p className="text-gray-500 mt-1 mb-2 font-medium">{s.desc}</p>
                <span className="inline-block bg-indigo-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">{s.tempo}</span>
              </div>
              <span className="font-bold text-lg text-purple-800 min-w-[80px] text-right">{`R$ ${s.preco.toFixed(2)}`}</span>
            </label>
          ))}
          {servicosFiltrados.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Nenhum serviço nesta categoria.
            </div>
          )}
        </div>
      </main>

      {/* Botão fixo "Continuar" */}
      <footer className="fixed left-0 right-0 bottom-0 flex justify-center z-30 bg-opacity-0 pointer-events-none">
        <button
          className={`pointer-events-auto w-full max-w-2xl bg-purple-600 h-14 text-white text-lg font-bold rounded-xl shadow-lg mb-4 mx-2
                      transition focus:ring-4 ring-purple-300
                      ${servicoSel === null ? "opacity-60 cursor-not-allowed" : "hover:bg-purple-700"}`}
          disabled={servicoSel === null}
          onClick={() => {
            if (servicoSel !== null) {
              const s = servicosFiltrados[servicoSel];
              alert(`Você selecionou: ${s.nome} - ${s.tempo} - R$${s.preco.toFixed(2)}`);
            }
          }}
        >
          {servicoSel !== null
            ? `Continuar - ${servicosFiltrados[servicoSel].nome} (R$ ${servicosFiltrados[servicoSel].preco.toFixed(2)})`
            : "Continuar"}
        </button>
      </footer>

      {/* Modal do Mapa com distância/tempo */}
      {showMap && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-lg min-w-[320px] max-w-sm flex flex-col items-center relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-purple-600 text-2xl"
            >&times;</button>
            <h2 className="text-xl font-bold mb-2 text-purple-700">Distância até o salão</h2>
            {carregando && <p className="mt-2">Calculando rota...</p>}
            {erro && <p className="mt-2 text-red-500">{erro}</p>}
            {distancia && duracao && (
              <>
                <p className="mb-1 text-lg">Distância: <b>{distancia}</b></p>
                <p className="mb-3 text-lg">Tempo estimado: <b>{duracao}</b></p>
              </>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ENDERECO_DESTINO)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition"
            >
              Ver trajeto no Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}