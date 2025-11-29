import { useState, useEffect } from "react";
import { FaStore, FaSpinner, FaUserShield } from "react-icons/fa";
import { MdOutlineStorefront } from "react-icons/md";
import { FaScissors } from "react-icons/fa6";
import api from "../../../services/api";

interface ResumoAdmin {
  totalPrestadores: number;
  totalClientes: number;
  totalServicosAtivos: number;
  totalNegociosAtivos: number;
  totalAgendamentos: number;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
}

interface PageResponse {
  content: Usuario[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export default function PainelAdm() {
  return <><Dashboard /></>;
}

function Dashboard() {
  const [resumo, setResumo] = useState<ResumoAdmin | null>(null);
  const [admins, setAdmins] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;

  // Buscar resumo
  useEffect(() => {
    async function buscarResumo() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token não encontrado");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/relatorios/admin/resumo", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setResumo(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar resumo:", err);
        setError("Erro ao carregar dados do resumo");
      } finally {
        setLoading(false);
      }
    }

    buscarResumo();
  }, []);

  // Buscar administradores
  useEffect(() => {
    async function buscarAdmins() {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingAdmins(true);
      try {
        const params: any = {
          perfil: "ADMIN",
          page: page,
          size: size,
          sortBy: "id",
          direction: "asc"
        };

        const response = await api.get<PageResponse>("/usuarios/todos", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setAdmins(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (err: any) {
        console.error("Erro ao buscar administradores:", err);
        setError("Erro ao carregar administradores");
      } finally {
        setLoadingAdmins(false);
      }
    }

    buscarAdmins();
  }, [page]);

  function formatarTelefone(telefone: string) {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  return (
    <section className="w-full min-h-screen bg-gray-50">
      {/* Barra superior */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
      </div>

      {error && (
        <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Cards de resumo */}
      {loading ? (
        <div className="p-4 sm:p-6 flex justify-center">
          <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        </div>
      ) : resumo && (
        <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-indigo-500">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FaScissors size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-gray-800">{resumo.totalAgendamentos}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-purple-500">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><FaStore size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total de Prestadores</p>
              <p className="text-2xl font-bold text-gray-800">{resumo.totalPrestadores}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-blue-500">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FaStore size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{resumo.totalClientes}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-green-500">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><MdOutlineStorefront size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Negócios Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{resumo.totalNegociosAtivos}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 border-yellow-500">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><FaScissors size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{resumo.totalServicosAtivos}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabela/Card de administradores */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Administradores do Sistema</h2>
              <p className="text-sm text-gray-500">Listagem de todos os administradores cadastrados</p>
            </div>
            <div className="text-sm text-gray-500">
              {loadingAdmins ? "Carregando..." : `${admins.length} de ${totalElements} administradores`}
            </div>
          </div>

          {loadingAdmins ? (
            <div className="py-12 flex justify-center">
              <FaSpinner className="animate-spin text-purple-600 text-3xl" />
            </div>
          ) : admins.length > 0 ? (
            <>
              {/* Tabela Desktop */}
              <div className="hidden md:block">
                <div className="grid grid-cols-4 border-b bg-gray-50 py-3 px-6 text-sm font-medium text-gray-500">
                  <div className="col-span-2">Administrador</div>
                  <div className="text-center">Contato</div>
                  <div className="text-center">Status</div>
                </div>
                {admins.map(admin => (
                  <div key={admin.id} className="grid grid-cols-4 border-b py-4 px-6 hover:bg-gray-50 transition">
                    <div className="col-span-2 flex items-center">
                      <div className="p-2 mr-3 bg-purple-100 text-purple-600 rounded-md"><FaUserShield size={20} /></div>
                      <div>
                        <p className="font-medium text-gray-800">{admin.nome}</p>
                        <p className="text-xs text-gray-500">ID: #{admin.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-sm">
                      <span className="text-xs text-gray-600">{admin.email}</span>
                      <span className="text-xs text-gray-500">{formatarTelefone(admin.telefone)}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        admin.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {admin.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Mobile */}
              <div className="md:hidden">
                {admins.map(admin => (
                  <div key={admin.id} className="border-b p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center mb-3">
                      <div className="p-2 mr-3 bg-purple-100 text-purple-600 rounded-md"><FaUserShield size={20} /></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{admin.nome}</p>
                        <p className="text-xs text-gray-500">ID: #{admin.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1 text-xs">Email</p>
                        <p className="font-bold text-xs truncate">{admin.email}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1 text-xs">Telefone</p>
                        <p className="font-bold text-xs">{formatarTelefone(admin.telefone)}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500 mb-1 text-xs">Status</p>
                        <p className={`font-bold text-xs ${
                          admin.ativo ? "text-green-700" : "text-red-700"
                        }`}>
                          {admin.ativo ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center items-center gap-2 border-t">
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
              Nenhum administrador cadastrado
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
