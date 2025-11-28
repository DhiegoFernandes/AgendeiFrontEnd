import { useState, useEffect } from "react";
import { FiUser, FiSearch, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

interface ClienteType {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
  cep?: string;
  endereco?: string;
  numero?: string;
}

interface PageResponse {
  content: ClienteType[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

function normaliza(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function ClienteAdm() {
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [edita, setEdita] = useState<ClienteType | null>(null);
  const [modalPopup, setModalPopup] = useState<false | string>(false);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;
  const [erros, setErros] = useState<any>({});


  // Buscar clientes
  useEffect(() => {
    async function buscarClientes() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params: any = {
          perfil: "CLIENTE",
          page: page,
          size: size,
          sortBy: "id",
          direction: "asc"
        };

        if (pesquisa) {
          params.nome = pesquisa;
        }

        const response = await api.get<PageResponse>("/usuarios/todos", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setClientes(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error: any) {
        console.error("Erro ao buscar clientes:", error);
        setModalPopup("Erro ao carregar clientes. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    buscarClientes();
  }, [page, pesquisa]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  function validarCampos(cliente: ClienteType) {
    const errosTemp: any = {};

    // Nome
    if (!cliente.nome || cliente.nome.trim().length < 3) {
      errosTemp.nome = "O nome deve ter pelo menos 3 caracteres.";
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(cliente.nome)) {
      errosTemp.nome = "O nome deve conter apenas letras.";
    }


    // Email
    if (!cliente.email) {
      errosTemp.email = "O email é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      errosTemp.email = "Formato de email inválido.";
    }

    // Telefone
    if (!/^[0-9()\-\s+]*$/.test(cliente.telefone)) {
      errosTemp.telefone = "Telefone deve conter apenas números (com ou sem máscara).";
    }

    const tel = cliente.telefone.replace(/\D/g, "");

    if (tel.length < 11) {
      errosTemp.telefone = "Telefone deve ter pelo menos 11 dígitos.";
    } else if (tel.length > 15) {
      errosTemp.telefone = "Telefone deve ter no máximo 15 dígitos.";
    }

    // CEP
    if (cliente.cep && cliente.cep.trim() !== "") {
      // Se tiver qualquer letra, bloqueia imediatamente
      if (!/^\d+$/.test(cliente.cep)) {
        errosTemp.cep = "CEP deve conter apenas números.";
      }
      // só passa se for 100% números

      if (cliente.cep.length !== 8) {
        errosTemp.cep = "CEP deve ter exatamente 8 dígitos.";
      }
    }


    // Endereço
    if (cliente.endereco && cliente.endereco.length < 3) {
      errosTemp.endereco = "Endereço muito curto.";
    }

    // Número
    if (!cliente.numero || cliente.numero.trim() === "") {
      errosTemp.numero = "Número é obrigatório.";
    } else if (!/^\d+$/.test(cliente.numero)) {
      errosTemp.numero = "Número deve conter apenas dígitos.";
    } else if (Number(cliente.numero) <= 0) {
      errosTemp.numero = "Número não pode ser negativo ou zero.";
    }


    setErros(errosTemp);
    return Object.keys(errosTemp).length === 0;
  }

  async function handleSalvar() {
    if (!edita) return;

    // VALIDAR
    if (!validarCampos(edita)) {
      setModalPopup("Corrija os erros antes de salvar.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setModalPopup("Erro: Token não encontrado!");
      return;
    }

    setSalvando(true);
    try {
      await api.put(`/usuarios/admin/${edita.id}`, {
        nome: edita.nome,
        email: edita.email,
        telefone: edita.telefone,
        ativo: edita.ativo,
        cep: edita.cep || "",
        endereco: edita.endereco || "",
        numero: edita.numero || ""
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setModalPopup("Dados alterados com sucesso!");
      setEdita(null);

      // Recarregar lista
      const params: any = {
        perfil: "CLIENTE",
        page: page,
        size: size,
        sortBy: "id",
        direction: "asc"
      };
      if (pesquisa) params.nome = pesquisa;

      const response = await api.get<PageResponse>("/usuarios/todos", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setClientes(response.data.content);
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Erro ao salvar alterações. Tente novamente.";
      setModalPopup(errorMessage);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Lista de Clientes</h2>

      <form onSubmit={handleBusca} className="mb-4 flex items-center gap-2 max-w-lg">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none text-base shadow-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        </div>
      ) : clientes.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {clientes.map(c => (
              <li
                key={c.id}
                className="flex items-center gap-4 px-3 py-3 bg-white rounded-lg shadow hover:bg-purple-50 transition cursor-pointer"
                tabIndex={0}
                onClick={() => setEdita({ ...c })}
              >
                <span className="avatar bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
                  {c.nome.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2)}
                </span>
                <div className="flex-1">
                  <div className="font-bold">{c.nome}</div>
                  <div className="text-gray-500 text-sm">{c.email}</div>
                  <div className="text-gray-400 text-xs">{c.telefone}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${c.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
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
                Página {page + 1} de {totalPages} ({totalElements} total)
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
          {pesquisa ? `Nenhum cliente encontrado para "${pesquisa}"` : "Nenhum cliente cadastrado"}
        </div>
      )}

      {/* Modal de edição */}
      {edita && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" tabIndex={-1}>
          <form
            className="bg-white max-w-md w-full rounded-2xl shadow-2xl px-8 py-8 flex flex-col gap-5 animate-fadeIn max-h-[90vh] overflow-y-auto"
            onSubmit={e => { e.preventDefault(); handleSalvar(); }}
            autoComplete="off"
          >
            <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Editar Cliente</h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeCliente">
                <FiUser className="inline mr-1" /> Nome
              </label>
              <input
                id="nomeCliente"
                value={edita.nome}
                onChange={e => {
                  setEdita(v => (v ? { ...v, nome: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, nome: "" })); // limpa erro ao digitar
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.nome ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
                required
              />
              {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
            </div>


            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="emailCliente">
                <FiMail className="inline mr-1" /> Email
              </label>

              <input
                id="emailCliente"
                value={edita.email}
                onChange={e => {
                  setEdita(v => (v ? { ...v, email: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, email: "" }));
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.email ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
                required
              />

              {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
            </div>


            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="telefoneCliente">
                <FiPhone className="inline mr-1" /> Telefone
              </label>

              <input
                id="telefoneCliente"
                value={edita.telefone}
                onChange={e => {
                  setEdita(v => (v ? { ...v, telefone: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, telefone: "" }));
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.telefone ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
              />

              {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
            </div>


            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="cepCliente">
                <FiMapPin className="inline mr-1" /> CEP
              </label>

              <input
                id="cepCliente"
                value={edita.cep || ""}
                onChange={e => {
                  setEdita(v => (v ? { ...v, cep: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, cep: "" }));
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.cep ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
              />

              {erros.cep && <p className="text-red-500 text-sm mt-1">{erros.cep}</p>}
            </div>


            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoCliente">
                Endereço
              </label>

              <input
                id="enderecoCliente"
                value={edita.endereco || ""}
                onChange={e => {
                  setEdita(v => (v ? { ...v, endereco: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, endereco: "" }));
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.endereco ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
              />

              {erros.endereco && <p className="text-red-500 text-sm mt-1">{erros.endereco}</p>}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="numeroCliente">
                Número
              </label>

              <input
                id="numeroCliente"
                value={edita.numero || ""}
                onChange={e => {
                  setEdita(v => (v ? { ...v, numero: e.target.value } : v));
                  setErros((prev: any) => ({ ...prev, numero: "" }));
                }}
                className={`w-full px-4 py-2 border-2 rounded-lg text-base outline-none
      ${erros.numero ? "border-red-400" : "border-purple-200 focus:ring-purple-400 focus:ring-2"}
    `}
              />

              {erros.numero && <p className="text-red-500 text-sm mt-1">{erros.numero}</p>}
            </div>


            <div>
              <label className="block font-bold text-gray-700 mb-1">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={edita.ativo === true}
                    onChange={() => setEdita(v => (v ? { ...v, ativo: true } : v))}
                    className="cursor-pointer"
                  />
                  <span className="text-green-700 font-medium">Ativo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={edita.ativo === false}
                    onChange={() => setEdita(v => (v ? { ...v, ativo: false } : v))}
                    className="cursor-pointer"
                  />
                  <span className="text-red-700 font-medium">Inativo</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-3 w-full">
              <button
                type="button"
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-red-200 transition cursor-pointer"
                onClick={() => setEdita(null)}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? "Salvando..." : "Salvar alteração"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popup de feedback */}
      {modalPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-4 text-center">{modalPopup}</span>
            <button
              className="px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setModalPopup(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}
