import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { buscarFotosNegocio, buscarImagemFoto, construirUrlFoto } from "../../services/fotoService";
import type { FotoNegocio } from "../../types/user";
import ClientNavbar from "../../components/ClientNavbar";
import ListaServicosPorPrestador from "../../components/ListaServicosPorPrestador";

// Interface para os dados do negócio
interface NegocioData {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  cep: string;
  categoria: string;
  ativo: boolean;
  notaMedia: number;
}

// Interface para os serviços
interface ServicoData {
  id: number;
  titulo: string;
  descricao: string;
  valor: number;
  duracaoMinutos: number;
  ativo: boolean;
  prestadorId: number;
  nomePrestador: string;
  negocioId: number;
  fotoPrestadorUrl: string;
}

// Função para formatar endereço completo
function formatarEndereco(endereco: string, numero: string, cep: string): string {
  const partes = [endereco, numero, cep].filter(Boolean);
  return partes.join(", ");
}

export default function EscolherServico() {
  const location = useLocation();
  const navigate = useNavigate();
  const negocioId = location.state?.negocioId as number | undefined;
  
  const [servicoSel, setServicoSel] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState("");
  
  // Estados para dados da API
  const [negocio, setNegocio] = useState<NegocioData | null>(null);
  const [servicos, setServicos] = useState<ServicoData[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  
  // Estados para foto do negócio
  const [fotoNegocio, setFotoNegocio] = useState<string | null>(null);
  const [carregandoFoto, setCarregandoFoto] = useState(true);
  const fotoNegocioRef = useRef<string | null>(null);
  
  // Carregar dados do negócio e serviços
  useEffect(() => {
    async function carregarDados() {
      if (!negocioId) {
        setErro("ID do negócio não encontrado. Redirecionando...");
        setTimeout(() => navigate("/cliente/comercios"), 2000);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setErro("Token não encontrado. Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        setCarregandoDados(true);
        
        // Primeira requisição: dados do negócio
        const negocioResponse = await api.get(`/negocios/${negocioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        setNegocio(negocioResponse.data);
        
        // Segunda requisição: serviços do negócio
        const servicosResponse = await api.get(`/servicos/negocio/${negocioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        // Filtrar apenas serviços ativos
        const servicosAtivos = servicosResponse.data.filter((s: ServicoData) => s.ativo);
        setServicos(servicosAtivos);
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar dados do negócio. Tente novamente.");
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [negocioId, navigate]);

  // Carregar primeira foto do negócio
  useEffect(() => {
    async function carregarPrimeiraFoto() {
      if (!negocioId) {
        setCarregandoFoto(false);
        return;
      }

      setCarregandoFoto(true);
      setFotoNegocio(null);

      try {
        // Buscar lista de fotos
        const fotosLista = await buscarFotosNegocio(negocioId);

        if (fotosLista.length === 0) {
          setCarregandoFoto(false);
          return;
        }

        // Pegar a primeira foto
        const primeiraFoto: FotoNegocio = fotosLista[0];

        try {
          // Buscar a imagem em blob
          const blob = await buscarImagemFoto(negocioId, primeiraFoto.id);
          const url = URL.createObjectURL(blob);
          fotoNegocioRef.current = url;
          setFotoNegocio(url);
        } catch (error) {
          console.error(`Erro ao carregar foto ${primeiraFoto.id}:`, error);
          // Se falhar, usar a URL direta
          const urlDireta = construirUrlFoto(primeiraFoto);
          fotoNegocioRef.current = urlDireta;
          setFotoNegocio(urlDireta);
        }
      } catch (error) {
        console.error("Erro ao carregar fotos do negócio:", error);
        // Em caso de erro, não exibir foto (será mostrado placeholder)
      } finally {
        setCarregandoFoto(false);
      }
    }

    carregarPrimeiraFoto();

    // Cleanup: revogar URL do blob quando o componente desmontar ou negocioId mudar
    return () => {
      if (fotoNegocioRef.current && fotoNegocioRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(fotoNegocioRef.current);
        fotoNegocioRef.current = null;
      }
    };
  }, [negocioId]);
  
  const servicosFiltrados = servicos.filter(s => {
    const matchBusca = !busca || 
      s.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      s.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      s.nomePrestador.toLowerCase().includes(busca.toLowerCase());
    return matchBusca;
  });

  async function handleVerMapa() {
    if (!negocio) return;
    
    setShowMap(true);
    setErro(null);
    
    // Montar endereço completo do negócio
    const enderecoCompleto = formatarEndereco(negocio.endereco, negocio.numero, negocio.cep);
    const encodedAddress = encodeURIComponent(enderecoCompleto);
    setMapUrl(`https://www.google.com/maps?q=${encodedAddress}&output=embed`);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          try {
            // Tentar calcular distância usando a Distance Matrix API via proxy
            const origem = `${latitude},${longitude}`;
            const enderecoCompleto = negocio ? formatarEndereco(negocio.endereco, negocio.numero, negocio.cep) : "";
            const destino = encodeURIComponent(enderecoCompleto);
            
            // Configuramos um URL padrão de direções
            setMapUrl(`https://www.google.com/maps?saddr=${origem}&daddr=${destino}&output=embed`);
          } catch (error) {
            console.error("Erro ao calcular distância:", error);
            setErro("Não foi possível calcular a distância exata");
          }
        },
        (error) => {
          console.error("Erro de geolocalização:", error);
          setErro("Não foi possível obter sua localização");
        }
      );
    } else {
      setErro("Geolocalização não suportada no seu navegador");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-24">
      <ClientNavbar />
      {/* Cabeçalho */}

      {/* Card do barbeiro/comércio */}
      <section className="max-w-2xl mx-auto -mt-8 mt-3">
        {carregandoDados ? (
          <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-6 py-8 mt-8">
            <p className="text-gray-500">Carregando dados do negócio...</p>
          </div>
        ) : negocio ? (
          <div className="flex items-center bg-white rounded-2xl shadow-lg px-6 py-4 mt-8 gap-4 md:gap-6">
            {carregandoFoto ? (
              <div className="w-16 h-16 rounded-xl border shadow bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-xs">Carregando...</div>
              </div>
            ) : fotoNegocio ? (
              <img 
                src={fotoNegocio} 
                alt={`Imagem de ${negocio.nome}`} 
                className="w-16 h-16 object-cover rounded-xl border shadow bg-gray-50"
                onError={(e) => {
                  // Fallback caso a imagem não carregue
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagem indisponível%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-xl border shadow bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-xs text-center px-1">Imagem indisponível</div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">{negocio.nome}</h2>
              <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500 font-medium">
                <span className="text-yellow-500 text-base">★ {negocio.notaMedia !== null && negocio.notaMedia !== undefined ? negocio.notaMedia.toFixed(1) : "N/A"}</span>
                <span className="opacity-70">· {formatarEndereco(negocio.endereco, negocio.numero, negocio.cep)}</span>
              </div>
            </div>
            <button
              onClick={handleVerMapa}
              className="ml-auto px-4 py-2 font-semibold text-purple-600 border border-purple-300 rounded-lg shadow-sm hover:bg-purple-50 transition text-[16px] self-start"
            >
              Ver mapa
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-6 py-8 mt-8">
            <p className="text-red-500">{erro || "Erro ao carregar dados do negócio"}</p>
          </div>
        )}
      </section>

      {/* Barra de pesquisa */}
      <nav className="w-full bg-white border-t border-b border-gray-100 sticky top-[60px] z-10 mt-6 shadow">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="w-full py-2 pl-4 pr-20 rounded-full border border-gray-300 bg-gray-100 text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-200 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            {/* Botão de limpar pesquisa (X) */}
            {busca && (
              <button
                onClick={() => setBusca("")}
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
                <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
      </nav>

      {/* Lista de serviços */}
      <main className="max-w-2xl mx-auto py-8 px-3">
        <h3 className="text-xl font-bold mb-4">Serviços disponíveis</h3>
        {carregandoDados ? (
          <div className="text-center text-gray-400 py-12">
            Carregando serviços...
          </div>
        ) : (
          <ListaServicosPorPrestador
            servicos={servicosFiltrados}
            servicoSel={servicoSel}
            onSelecionarServico={setServicoSel}
          />
        )}
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
              const servicoSelecionado = servicos.find(s => s.id === servicoSel);
              if (servicoSelecionado) {
                // Navegar para a página de agendar horário passando os dados necessários
                navigate("/cliente/agendar-horario", {
                  state: {
                    servicoId: servicoSelecionado.id,
                    negocioId: negocioId,
                    servicoNome: servicoSelecionado.titulo,
                    servicoValor: servicoSelecionado.valor,
                    servicoDuracao: servicoSelecionado.duracaoMinutos,
                    nomePrestador: servicoSelecionado.nomePrestador
                  }
                });
              }
            }
          }}
        >
          {servicoSel !== null
            ? (() => {
                const servicoSelecionado = servicos.find(s => s.id === servicoSel);
                return servicoSelecionado 
                  ? `Continuar - ${servicoSelecionado.titulo} (R$ ${servicoSelecionado.valor.toFixed(2)})`
                  : "Continuar";
              })()
            : "Continuar"}
        </button>
      </footer>

      {/* Modal do Mapa do Google - COM DISTÂNCIA E TEMPO */}
      {showMap && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col relative h-[85vh]">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-purple-600 text-3xl z-10 bg-white bg-opacity-80 w-8 h-8 flex items-center justify-center rounded-full"
            >
              &times;
            </button>
            
            <div className="p-4">
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                Localização {negocio ? `de ${negocio.nome}` : "do negócio"}
              </h2>
            </div>
            
            {/* Mapa do Google - Usando iframe padrão */}
            <div className="flex-1 px-4 pb-4 overflow-hidden">
              {mapUrl && (
                <iframe 
                  src={mapUrl}
                  className="w-full h-full rounded-lg border border-gray-200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
            
            <div className="p-4 flex justify-center">
              {negocio && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatarEndereco(negocio.endereco, negocio.numero, negocio.cep))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition"
                >
                  Abrir no Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}