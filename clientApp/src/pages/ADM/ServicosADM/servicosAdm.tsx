import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

interface Negocio {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  numero: string;
  categoria: string;
  ativo: boolean;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
  negocio?: Negocio;
  plano?: string;
}

interface PageResponse {
  content: Usuario[];
  totalPages: number;
  totalElements: number;
}

export default function ServicosAdm() {
  const [prestadores, setPrestadores] = useState<Usuario[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 20;

  useEffect(() => {
    async function buscarPrestadores() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get<PageResponse>("/usuarios/todos", {
          params: {
            perfil: "PRESTADOR",
            page: page,
            size: size,
            sortBy: "id",
            direction: "asc"
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setPrestadores(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        console.error("Erro ao buscar prestadores:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarPrestadores();
  }, [page]);

  // Filtrar apenas prestadores com negócio
  const prestadoresComNegocio = prestadores.filter(p => p.negocio);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Visualizar Serviços</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        </div>
      ) : prestadoresComNegocio.length > 0 ? (
        <>
          <ul className="flex flex-col gap-6">
            {prestadoresComNegocio.map(pres => (
              <li key={pres.id} className="bg-gray-50 rounded-xl shadow px-6 py-5">
                <button
                  className="flex items-center w-full group cursor-pointer"
                  onClick={() => setExpandido(expandido === pres.id ? null : pres.id)}
                >
                  <span className="avatar bg-purple-400 text-white w-10 h-10 rounded-full font-bold flex items-center justify-center mr-3 text-lg select-none">
                    {pres.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                  <div className="flex-1 text-left">
                    <span className="font-bold text-base">{pres.nome}</span>
                    <span className="text-gray-500 text-xs ml-3">
                      Negócio: {pres.negocio?.nome} • Categoria: {pres.negocio?.categoria}
                    </span>
                  </div>
                  <span className={`ml-2 transition text-lg text-purple-400 ${expandido === pres.id ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                </button>
                {expandido === pres.id && (
                  <div className="mt-5 p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Email:</strong> {pres.email}</p>
                      <p><strong>Telefone:</strong> {pres.telefone}</p>
                      <p><strong>Plano:</strong> {pres.plano || "N/A"}</p>
                      <p><strong>Status:</strong> {pres.ativo ? "Ativo" : "Inativo"}</p>
                      {pres.negocio && (
                        <>
                          <div className="border-t pt-2 mt-2">
                            <p className="font-semibold text-gray-700 mb-1">Informações do Negócio:</p>
                            <p><strong>Nome:</strong> {pres.negocio.nome}</p>
                            <p><strong>Endereço:</strong> {pres.negocio.endereco}, {pres.negocio.numero}</p>
                            <p><strong>CEP:</strong> {pres.negocio.cep}</p>
                            <p><strong>Categoria:</strong> {pres.negocio.categoria}</p>
                            <p><strong>Status:</strong> {pres.negocio.ativo ? "Ativo" : "Inativo"}</p>
                          </div>
                        </>
                      )}
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-700">
                          💡 Para visualizar os serviços específicos deste prestador, acesse o perfil do prestador na seção "Prestadores".
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-gray-500">
          Nenhum prestador com negócio cadastrado
        </div>
      )}
    </>
  );
}
