import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiBriefcase } from "react-icons/fi";
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

const CATEGORIAS_FIXAS = ["BELEZA", "ESTETICA", "BARBEARIA", "MAQUIAGEM", "MANICURE", "OUTROS"];

export default function ServicosAdm() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [edita, setEdita] = useState<Negocio | null>(null);
  const [modalPopup, setModalPopup] = useState<false | string>(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Buscar negócios
  useEffect(() => {
    async function buscarNegocios() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let response;

        if (pesquisa.trim()) {
          // Buscar por nome
          response = await api.get<Negocio[] | { content: Negocio[] }>("/negocios/buscar-por-nome", {
            params: {
              nome: pesquisa
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          // A resposta pode ser um array direto ou um objeto com content
          const dados = Array.isArray(response.data) ? response.data : (response.data as any).content || [];
          setNegocios(dados);
        } else {
          // Buscar todos
          response = await api.get<Negocio[] | { content: Negocio[] }>("/negocios/todos", {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          // A resposta pode ser um array direto ou um objeto com content
          const dados = Array.isArray(response.data) ? response.data : (response.data as any).content || [];
          setNegocios(dados);
        }
      } catch (error: any) {
        console.error("Erro ao buscar negócios:", error);
        setModalPopup("Erro ao carregar negócios. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    buscarNegocios();
  }, [pesquisa]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
  };

  function validarNegocio(negocio: Negocio) {
    const erros: any = {};

    // Nome — não pode ter números
    if (!negocio.nome.trim()) {
      erros.nome = "Nome é obrigatório.";
    }

    // CEP — só números e 8 dígitos
    const cepSomenteNumeros = negocio.cep.replace(/\D/g, "");
    if (!cepSomenteNumeros) {
      erros.cep = "CEP é obrigatório.";
    } else if (!/^[0-9]+$/.test(cepSomenteNumeros)) {
      erros.cep = "CEP deve conter apenas números.";
    } else if (cepSomenteNumeros.length !== 8) {
      erros.cep = "CEP deve ter exatamente 8 números.";
    }

    // Endereço — obrigatório
    if (!negocio.endereco.trim()) {
      erros.endereco = "Endereço é obrigatório.";
    }

    // Número — não pode ter letra e nem ser negativo
    if (!negocio.numero.trim()) {
      erros.numero = "Número é obrigatório.";
    } else if (!/^[0-9]+$/.test(negocio.numero)) {
      erros.numero = "Número deve conter apenas números positivos.";
    } else if (Number(negocio.numero) < 0) {
      erros.numero = "Número não pode ser negativo.";
    }

    // Categoria — validar lista
    if (!CATEGORIAS_FIXAS.includes(negocio.categoria)) {
      erros.categoria = "Categoria inválida.";
    }

    return erros;
  }


  async function handleSalvar() {
    if (!edita) return;

    const erros = validarNegocio(edita);

    if (Object.keys(erros).length > 0) {
      const primeiraMensagem = Object.values(erros)[0];
      setModalPopup(primeiraMensagem as string);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setModalPopup("Erro: Token não encontrado!");
      return;
    }

    setSalvando(true);
    try {
      await api.put(`/negocios/${edita.id}`, {
        nome: edita.nome,
        cep: edita.cep,
        endereco: edita.endereco,
        numero: edita.numero,
        categoria: edita.categoria,
        ativo: edita.ativo
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setModalPopup("Dados do negócio alterados com sucesso!");
      setEdita(null);

      // Recarregar lista
      try {
        let response;
        if (pesquisa.trim()) {
          response = await api.get<Negocio[] | { content: Negocio[] }>("/negocios/buscar-por-nome", {
            params: { nome: pesquisa },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          response = await api.get<Negocio[] | { content: Negocio[] }>("/negocios/todos", {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
        const dados = Array.isArray(response.data) ? response.data : (response.data as any).content || [];
        setNegocios(dados);
      } catch (error) {
        console.error("Erro ao recarregar lista:", error);
      }
    } catch (error: any) {
      console.error("Erro ao salvar negócio:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Erro ao salvar alterações. Tente novamente.";
      setModalPopup(errorMessage);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Lista de Negócios</h2>

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
      ) : negocios.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {negocios.map(negocio => (
              <li
                key={negocio.id}
                className="flex items-center gap-4 px-3 py-3 bg-white rounded-lg shadow hover:bg-purple-50 transition cursor-pointer"
                tabIndex={0}
                onClick={() => setEdita({ ...negocio })}
              >
                <span className="avatar bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
                  <FiBriefcase className="text-xl" />
                </span>
                <div className="flex-1">
                  <div className="font-bold">{negocio.nome}</div>
                  <div className="text-gray-500 text-sm">
                    <FiMapPin className="inline mr-1" />
                    {negocio.endereco}, {negocio.numero} - {negocio.cep}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Categoria: {negocio.categoria} •
                    {negocio.ativo ? " Ativo" : " Inativo"}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${negocio.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {negocio.ativo ? "Ativo" : "Inativo"}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="py-12 text-center text-gray-500">
          {pesquisa ? `Nenhum negócio encontrado para "${pesquisa}"` : "Nenhum negócio cadastrado"}
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
            <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Editar Negócio</h2>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeNegocio">
                Nome do Negócio
              </label>
              <input
                id="nomeNegocio"
                value={edita.nome}
                onChange={e => setEdita(v => (v ? { ...v, nome: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="cepNegocio">
                CEP
              </label>
              <input
                id="cepNegocio"
                value={edita.cep}
                onChange={e => setEdita(v => (v ? { ...v, cep: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="00000-000"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoNegocio">
                Endereço
              </label>
              <input
                id="enderecoNegocio"
                value={edita.endereco}
                onChange={e => setEdita(v => (v ? { ...v, endereco: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="numeroNegocio">
                Número
              </label>
              <input
                id="numeroNegocio"
                value={edita.numero}
                onChange={e => setEdita(v => (v ? { ...v, numero: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="categoriaNegocio">
                Categoria
              </label>
              <select
                id="categoriaNegocio"
                value={edita.categoria}
                onChange={e => setEdita(v => (v ? { ...v, categoria: e.target.value } : v))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none cursor-pointer"
                required
              >
                {CATEGORIAS_FIXAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
