import { useMemo, useEffect, useState, useRef } from "react";
import api from "../services/api";

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

interface ListaServicosPorPrestadorProps {
  servicos: ServicoData[];
  servicoSel: number | null;
  onSelecionarServico: (servicoId: number) => void;
}

export default function ListaServicosPorPrestador({
  servicos,
  servicoSel,
  onSelecionarServico,
}: ListaServicosPorPrestadorProps) {
  // Estado para armazenar as fotos dos prestadores (prestadorId -> URL da foto)
  const [fotosPrestadores, setFotosPrestadores] = useState<Map<number, string>>(new Map());
  const fotosCarregadasRef = useRef<Set<number>>(new Set());
  const fotosUrlsRef = useRef<Map<number, string>>(new Map());

  // Função para obter iniciais do nome
  function getInitials(name: string): string {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // Carregar fotos dos prestadores
  useEffect(() => {
    async function carregarFotosPrestadores() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const novasFotos = new Map<number, string>();
      const prestadoresParaCarregar: { id: number; url: string }[] = [];

      // Identificar prestadores únicos que ainda não foram carregados
      servicos.forEach((servico) => {
        if (
          servico.prestadorId &&
          servico.fotoPrestadorUrl &&
          !fotosCarregadasRef.current.has(servico.prestadorId)
        ) {
          prestadoresParaCarregar.push({
            id: servico.prestadorId,
            url: servico.fotoPrestadorUrl,
          });
          fotosCarregadasRef.current.add(servico.prestadorId);
        }
      });

      // Carregar fotos em paralelo
      await Promise.all(
        prestadoresParaCarregar.map(async ({ id, url }) => {
          try {
            // Construir URL completa se necessário
            let fotoUrl = url;
            if (!fotoUrl.startsWith("http")) {
              // Remove barra inicial se houver e adiciona baseURL
              fotoUrl = `${api.defaults.baseURL}${url.replace(/^\//, "")}`;
            }

            const fotoBlobResponse = await api.get(fotoUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            });

            if (fotoBlobResponse.data && fotoBlobResponse.data.size > 0) {
              const imageUrl = URL.createObjectURL(fotoBlobResponse.data);
              novasFotos.set(id, imageUrl);
              fotosUrlsRef.current.set(id, imageUrl);
            }
          } catch (error) {
            console.log(`Erro ao carregar foto do prestador ${id}:`, error);
            // Não adiciona nada ao Map, deixando null para usar placeholder
          }
        })
      );

      // Atualizar estado com novas fotos
      if (novasFotos.size > 0) {
        setFotosPrestadores((prev) => {
          const atualizado = new Map(prev);
          novasFotos.forEach((url, id) => {
            atualizado.set(id, url);
          });
          return atualizado;
        });
      }
    }

    carregarFotosPrestadores();

    // Cleanup: revogar URLs quando o componente desmontar
    return () => {
      fotosUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      fotosUrlsRef.current.clear();
    };
  }, [servicos]);
  // Agrupar serviços por prestador e ordenar
  const servicosPorPrestador = useMemo(() => {
    const agrupados: Record<string, ServicoData[]> = {};

    // Agrupar por prestador
    servicos.forEach((servico) => {
      const prestadorNome = servico.nomePrestador || "Sem prestador";
      if (!agrupados[prestadorNome]) {
        agrupados[prestadorNome] = [];
      }
      agrupados[prestadorNome].push(servico);
    });

    // Ordenar prestadores alfabeticamente
    const prestadoresOrdenados = Object.keys(agrupados).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" })
    );

    // Ordenar serviços dentro de cada prestador alfabeticamente
    prestadoresOrdenados.forEach((prestador) => {
      agrupados[prestador].sort((a, b) =>
        a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" })
      );
    });

    return { agrupados, prestadoresOrdenados };
  }, [servicos]);

  if (servicos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        Nenhum serviço disponível.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {servicosPorPrestador.prestadoresOrdenados.map((prestadorNome) => {
        const servicosDoPrestador = servicosPorPrestador.agrupados[prestadorNome];

        return (
          <div key={prestadorNome} className="flex flex-col gap-4">
            {/* Cabeçalho da seção do prestador */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <h4 className="text-lg font-bold text-purple-700 whitespace-nowrap">
                {prestadorNome}
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Lista de serviços do prestador */}
            <div className="flex flex-col gap-4">
              {servicosDoPrestador.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center px-6 py-5 rounded-2xl shadow-sm bg-white cursor-pointer border-2 transition-all
                    ${servicoSel === s.id ? "border-purple-500 bg-purple-50" : "border-white hover:border-purple-300"}
                  `}
                >
                  <input
                    type="radio"
                    checked={servicoSel === s.id}
                    onChange={() => onSelecionarServico(s.id)}
                    className="sr-only"
                    name="servico"
                  />
                  {/* Foto do prestador */}
                  <div className="flex-shrink-0 mr-4 relative">
                    {fotosPrestadores.has(s.prestadorId) && (
                      <img
                        src={fotosPrestadores.get(s.prestadorId)}
                        alt={s.nomePrestador}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                        onError={(e) => {
                          // Fallback para placeholder se a imagem falhar ao carregar
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                    )}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-purple-200 shadow-sm ${
                        fotosPrestadores.has(s.prestadorId) ? "hidden" : "flex"
                      }`}
                    >
                      {getInitials(s.nomePrestador)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center">
                      <span
                        className={`font-bold text-lg text-gray-900 ${
                          servicoSel === s.id ? "text-purple-700" : ""
                        }`}
                      >
                        {s.titulo}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1 mb-2 font-medium">{s.descricao}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-indigo-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                        {s.duracaoMinutos} min
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-purple-800 min-w-[80px] text-right">
                    {`R$ ${s.valor.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

