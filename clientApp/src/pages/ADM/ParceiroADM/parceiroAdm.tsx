import { useState, useEffect } from "react";
import { FiUser, FiSearch, FiPhone, FiMail } from "react-icons/fi";
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

interface PrestadorType {
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
  content: PrestadorType[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export default function ParceiroAdm() {
  const [prestadores, setPrestadores] = useState<PrestadorType[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [edita, setEdita] = useState<PrestadorType | null>(null);
  const [modalPopup, setModalPopup] = useState<false | string>(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;
  const [erros, setErros] = useState<any>({});

  // Buscar prestadores
  useEffect(() => {
    async function buscarPrestadores() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params: any = {
          perfil: "PRESTADOR",
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

        setPrestadores(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error: any) {
        console.error("Erro ao buscar prestadores:", error);
        setModalPopup("Erro ao carregar prestadores. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    buscarPrestadores();
  }, [page, pesquisa]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  function validarPrestador(p: PrestadorType) {
    const e: any = {};

    // NOME — somente letras e espaços
    if (!p.nome || p.nome.trim() === "") {
      e.nome = "Nome é obrigatório.";
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(p.nome)) {
      e.nome = "Nome deve conter apenas letras.";
    }

    // EMAIL — básico e confiável
    if (!p.email || p.email.trim() === "") {
      e.email = "Email é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      e.email = "Email inválido.";
    }

    // TELEFONE — somente números, mínimo 11, máximo 15
    if (!p.telefone || p.telefone.trim() === "") {
      e.telefone = "Telefone é obrigatório.";
    } else {

      // NÃO PODE conter letras ou símbolos
      if (!/^[0-9()\-+\s]*$/.test(p.telefone)) {
        e.telefone = "Telefone deve conter apenas números e caracteres de formatação.";
      }

      // Agora remove os caracteres de máscara
      const tel = p.telefone.replace(/\D/g, "");

      if (tel.length < 11) {
        e.telefone = "Telefone deve ter pelo menos 11 números.";
      } else if (tel.length > 15) {
        e.telefone = "Telefone deve ter no máximo 15 números.";
      }
    }



    return e;
  }

  async function handleSalvar() {
    if (!edita) return;

    const errosVal = validarPrestador(edita);
    setErros(errosVal);

    if (Object.keys(errosVal).length > 0) {
      setModalPopup("Corrija os campos antes de salvar.");
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
        ativo: edita.ativo
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setModalPopup("Dados do prestador alterados com sucesso!");
      setEdita(null);

      // Recarregar lista
      const params: any = {
        perfil: "PRESTADOR",
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
      setPrestadores(response.data.content);
    } catch (error: any) {
      console.error("Erro ao salvar prestador:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Erro ao salvar alterações. Tente novamente.";
      setModalPopup(errorMessage);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Lista de Prestadores</h2>

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
      ) : prestadores.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {prestadores.map(p => (
              <li
                key={p.id}
                className="flex items-center gap-4 px-3 py-3 bg-white rounded-lg shadow hover:bg-purple-50 transition cursor-pointer"
                tabIndex={0}
                onClick={() => setEdita({ ...p })}
              >
                <span className="avatar bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
                  {p.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
                <div className="flex-1">
                  <div className="font-bold">{p.nome}</div>
                  <div className="text-gray-500 text-sm">{p.email}</div>
                  <div className="text-gray-400 text-xs">
                    {p.negocio ? `Negócio: ${p.negocio.nome}` : "Sem negócio cadastrado"} •
                    {p.plano ? ` Plano: ${p.plano}` : " Sem plano"} •
                    {p.ativo ? " Ativo" : " Inativo"}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${p.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {p.ativo ? "Ativo" : "Inativo"}
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
          {pesquisa ? `Nenhum prestador encontrado para "${pesquisa}"` : "Nenhum prestador cadastrado"}
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
            <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Editar Prestador</h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="nomePrestador">
                <FiUser className="inline mr-1" /> Nome
              </label>
              <input
                id="nomePrestador"
                value={edita.nome}
                onChange={e => setEdita(v => (v ? { ...v, nome: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />{erros.nome && (
                <p className="text-red-600 text-sm mt-1">{erros.nome}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="emailPrestador">
                <FiMail className="inline mr-1" /> Email
              </label>
              <input
                id="emailPrestador"
                type="email"
                value={edita.email}
                onChange={e => setEdita(v => (v ? { ...v, email: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              /> {erros.email && (
                <p className="text-red-600 text-sm mt-1">{erros.email}</p>
              )}

            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="telefonePrestador">
                <FiPhone className="inline mr-1" /> Telefone
              </label>
              <input
                id="telefonePrestador"
                value={edita.telefone}
                onChange={e => setEdita(v => (v ? { ...v, telefone: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />{erros.telefone && (
                <p className="text-red-600 text-sm mt-1">{erros.telefone}</p>
              )}
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

            {edita.negocio && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Negócio Associado:</p>
                <p className="text-sm text-gray-600">{edita.negocio.nome}</p>
                <p className="text-xs text-gray-500">{edita.negocio.categoria}</p>
              </div>
            )}

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
