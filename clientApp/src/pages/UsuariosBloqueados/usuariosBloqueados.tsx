import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBan, FaUnlock, FaLock, FaUsers, FaSpinner } from "react-icons/fa";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Header from "../../components/Header";
import api from "../../services/api";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  bloqueado: boolean;
  taxaCancelamento: number;
}

export default function UsuariosBloqueados() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesBloqueados, setClientesBloqueados] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoBloqueados, setCarregandoBloqueados] = useState(false);
  const [processando, setProcessando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "bloqueados">("todos");
  const [popup, setPopup] = useState<string | false>(false);

  // Carregar todos os clientes do negócio
  async function carregarClientes() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCarregando(true);
      const response = await api.get("/agendamentos/clientes", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes do negócio:", error);
      setPopup("Erro ao carregar clientes do negócio. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  // Carregar clientes bloqueados do negócio
  async function carregarClientesBloqueados() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCarregandoBloqueados(true);
      const response = await api.get("/agendamentos/clientes/bloqueados", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setClientesBloqueados(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes bloqueados do negócio:", error);
      setPopup("Erro ao carregar clientes bloqueados do negócio. Tente novamente.");
    } finally {
      setCarregandoBloqueados(false);
    }
  }

  // Bloquear cliente
  async function bloquearCliente(clienteId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Erro: Token de autenticação não encontrado!");
      return;
    }


    try {
      setProcessando(clienteId);
      await api.put(`/agendamentos/clientes/${clienteId}/bloquear`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setPopup("Cliente bloqueado com sucesso!");

      // Recarregar listas
      await Promise.all([carregarClientes(), carregarClientesBloqueados()]);
    } catch (error: any) {
      console.error("Erro ao bloquear cliente:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Erro ao bloquear cliente. Tente novamente.";
      setPopup(errorMessage);
    } finally {
      setProcessando(null);
    }
  }

  // Desbloquear cliente
  async function desbloquearCliente(clienteId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup("Erro: Token de autenticação não encontrado!");
      return;
    }

    try {
      setProcessando(clienteId);
      await api.put(`/agendamentos/clientes/${clienteId}/desbloquear`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setPopup("Cliente desbloqueado com sucesso!");

      // Recarregar listas
      await Promise.all([carregarClientes(), carregarClientesBloqueados()]);
    } catch (error: any) {
      console.error("Erro ao desbloquear cliente:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Erro ao desbloquear cliente. Tente novamente.";
      setPopup(errorMessage);
    } finally {
      setProcessando(null);
    }
  }

  useEffect(() => {
    carregarClientes();
    carregarClientesBloqueados();
  }, []);

  const clientesExibidos = filtro === "todos" ? clientes : clientesBloqueados;
  const carregandoExibicao = filtro === "todos" ? carregando : carregandoBloqueados;

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-16">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header da página */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/parceiro/perfil")}
            className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 transition"
            title="Voltar"
          >
            <HiOutlineArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Usuários do negócio</h1>
            <p className="text-gray-600 mt-1">Gerencie o bloqueio e desbloqueio de clientes do negócio</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFiltro("todos")}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition cursor-pointer ${filtro === "todos"
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaUsers size={18} />
                <span>Todos os Clientes do Negócio ({clientes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setFiltro("bloqueados")}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition cursor-pointer ${filtro === "bloqueados"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaBan size={18} />
                <span>Bloqueados do Negócio ({clientesBloqueados.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {carregandoExibicao ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-purple-600 text-4xl mb-4" />
              <p className="text-gray-600 font-medium">Carregando clientes...</p>
            </div>
          ) : clientesExibidos.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 font-semibold text-lg">
                {filtro === "todos"
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente bloqueado"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientesExibidos.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border-2 transition ${cliente.bloqueado
                    ? "bg-red-50 border-red-200"
                    : "bg-purple-50 border-purple-200"
                    }`}
                >
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-extrabold text-gray-800">{cliente.nome}</h3>
                      {cliente.bloqueado && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Email:</strong> {cliente.email}</p>
                      <p><strong>Telefone:</strong> {cliente.telefone}</p>
                      <p>
                        <strong>Taxa de Cancelamento:</strong>{" "}
                        <span className={`font-bold ${cliente.taxaCancelamento >= 50
                          ? "text-red-600"
                          : cliente.taxaCancelamento >= 25
                            ? "text-yellow-600"
                            : "text-green-600"
                          }`}>
                          {cliente.taxaCancelamento.toFixed(2)}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    {cliente.bloqueado ? (
                      <button
                        onClick={() => desbloquearCliente(cliente.id)}
                        disabled={processando === cliente.id}
                        className={`px-4 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${processando === cliente.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:brightness-110 shadow cursor-pointer"
                          }`}
                      >
                        {processando === cliente.id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Processando...</span>
                          </>
                        ) : (
                          <>
                            <FaUnlock size={16} />
                            <span>Desbloquear</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => bloquearCliente(cliente.id)}
                        disabled={processando === cliente.id}
                        className={`px-4 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 ${processando === cliente.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-110 shadow cursor-pointer"
                          }`}
                      >
                        {processando === cliente.id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Processando...</span>
                          </>
                        ) : (
                          <>
                            <FaLock size={16} />
                            <span>Bloquear</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Popup de feedback */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md mx-4">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{popup}</span>
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

