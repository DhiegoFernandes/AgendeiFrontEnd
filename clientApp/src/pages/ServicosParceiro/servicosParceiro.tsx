import { useState } from "react";
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiArrowLeft
} from "react-icons/fi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const COMERCIO = "Barbearia Estilo";
const PRESTADOR = "Ricardo Almeida";
const CATEGORIAS_FIXAS = ["SPA", "ESTETICISTA", "OUTROS", "BARBEARIA", "MANICURE", "MAQUIAGEM"];
const CATEGORIAS_LIST = ["Todas", ...CATEGORIAS_FIXAS];
const SERVICOS_MOCK = [
  { id: 1, nome: "Corte Masculino", descricao: "Corte com tesoura e máquina", categoria: "Cortes", preco: "R$ 50,00", duracao: 30, ativo: true },
  { id: 2, nome: "Barba Tradicional", descricao: "Aparar, modelar e hidratar barba", categoria: "Barbas", preco: "R$ 35,00", duracao: 20, ativo: true },
  { id: 3, nome: "Hidratação capilar", descricao: "Revitalize seus fios", categoria: "Tratamentos", preco: "R$ 40,00", duracao: 40, ativo: false },
];

function currencyMask(value: string) {
  let v = value.replace(/\D/g, "");
  v = (Number(v) / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  return "R$ " + v;
}  

export default function ServicosParceiro() {
  const navigate = useNavigate();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [servicos, setServicos] = useState([...SERVICOS_MOCK]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    id: null as number | null,
    nome: "",
    descricao: "",
    categoria: CATEGORIAS_FIXAS[0],
    preco: "",
    duracao: "",
    ativo: true,
  });
  const [popup, setPopup] = useState<{ msg: string, ok?: () => void } | null>(null);

  const MAX_NOME = 50;
  const MAX_DESC = 200;

  function openForm(serv?: typeof form) {
    setForm(serv
      ? { ...serv }
      : { id: null, nome: "", descricao: "", categoria: CATEGORIAS_FIXAS[0], preco: "", duracao: "", ativo: true }
    );
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setForm({ id: null, nome: "", descricao: "", categoria: CATEGORIAS_FIXAS[0], preco: "", duracao: "", ativo: true });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "preco" ? currencyMask(value) : value
    }));
  }

  function handleCategoriaClick(cat: string) {
    setForm(f => ({ ...f, categoria: cat }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome.trim() || !form.categoria || !form.preco) {
      setPopup({ msg: "Preencha os campos obrigatórios!" }); return;
    }

    setServicos(list => {
      if (form.id !== null && form.id !== undefined) {
        return list.map(s => s.id === form.id ? { ...form } : s);
      } else {
        return [...list, { ...form, id: Date.now() }];
      }
    })

    const dataToPost = {
      titulo: form.nome,
      descricao: form.descricao,
      categoria: form.categoria,
      valor: parseFloat(
        form.preco
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      ),
      duracaoMinutos: Number(form.duracao),
      ativo: form.ativo
    }

    const token = localStorage.getItem("token")

    try {
      const response = await api.post('/servicos', dataToPost, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(response)
    } catch (error) {
      console.log(error)
    }

    closeForm();
    setTimeout(() => setPopup({ msg: `Serviço ${form.id ? "atualizado" : "cadastrado"} com sucesso!` }), 100);
  }

  function handleExcluir(id: number) {
    setPopup({
      msg: "Deseja excluir esse serviço?",
      ok: () => setServicos(s => s.filter(el => el.id !== id))
    });
  }

  function handleToggleAtivoServico(id: number) {
    setServicos(list =>
      list.map(s =>
        s.id === id ? { ...s, ativo: !s.ativo } : s
      )
    );
  }

  function handleToggleAtivo() {
    setForm(f => ({ ...f, ativo: !f.ativo }));
  }

  const servicosFiltrados =
    categoriaSelecionada === "Todas"
      ? servicos
      : servicos.filter(s => s.categoria === categoriaSelecionada);

  function handlePopupOk() { setPopup(null); }
  function handlePopupSim() { popup?.ok?.(); setPopup(null); }

  const modalClass = "bg-white max-w-md w-full p-4 sm:p-7 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-y-auto max-h-[94vh] animate-fadeIn";

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-14">
      {/* Navbar moderna */}
      <nav className="w-full bg-gradient-to-r from-purple-600 to-purple-400 px-5 py-5 rounded-b-[30px] rounded-t-2xl shadow flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-2">
        <button
          className="text-white font-bold flex items-center gap-2 transition hover:text-purple-200 cursor-pointer"
          onClick={() => navigate("/parceiro/perfil")}
        >
          <FiArrowLeft size={23} />
          Voltar ao perfil
        </button>
        <div className="text-center flex-1">
          <div className="text-xl md:text-2xl text-white font-extrabold">{COMERCIO}</div>
          <span className="font-semibold text-purple-200/90">{PRESTADOR}</span>
        </div>
        <div className="w-6 invisible" />
      </nav>

      {/* Categorias */}
      <div className="max-w-2xl mx-auto flex flex-wrap gap-2 mt-8 mb-3 pb-1 px-2">
        {CATEGORIAS_LIST.map(cat => (
          <button
            key={cat}
            className={
              "px-5 py-2 rounded-full font-bold shadow transition-all border cursor-pointer " +
              (categoriaSelecionada === cat
                ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white border-transparent"
                : "bg-gray-100 text-gray-700 hover:bg-purple-50 border-gray-200")
            }
            onClick={() => setCategoriaSelecionada(cat)}
            style={{ minWidth: 80 }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto flex justify-end mb-4 px-2">
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-2 px-7 rounded-lg shadow-md hover:brightness-110 transition text-base cursor-pointer"
          onClick={() => openForm()}
        >
          <FiPlus size={20} /> Cadastrar novo serviço
        </button>
      </div>

      {/* Formulário modal, agora SEM criar nova categoria */}
      {formOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center px-1 sm:px-2 py-2">
          <form
            className={modalClass}
            onSubmit={handleSubmit}
            style={{ maxWidth: '430px' }}
          >
            <button type="button" className="absolute right-4 top-4 text-gray-400 hover:text-purple-600 cursor-pointer" onClick={closeForm}>
              <FiX size={25} />
            </button>
            <h2 className="text-2xl font-bold text-purple-700 mb-1 text-center">{form.id ? "Atualizar serviço" : "Cadastrar novo serviço"}</h2>

            <div>
              <label className="font-bold text-gray-700" htmlFor="nome">Nome do serviço</label>
              <input
                id="nome"
                name="nome"
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg mt-1 text-base shadow-sm focus:ring-2 focus:ring-purple-300 outline-none"
                maxLength={MAX_NOME}
                value={form.nome}
                onChange={handleChange}
                autoFocus
                required
              />
              <span className="text-sm text-purple-400 absolute right-8 mt-1">{form.nome.length}/{MAX_NOME}</span>
            </div>

            <div>
              <label className="font-bold text-gray-700" htmlFor="descricao">Descrição (opcional)</label>
              <textarea
                id="descricao"
                name="descricao"
                maxLength={MAX_DESC}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg mt-1 text-base shadow-sm focus:ring-2 focus:ring-purple-300 outline-none resize-none"
                rows={3}
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex: Corte tradicional com tesoura e máquina"
              />
              <span className="text-sm text-purple-400 absolute right-8 mt-1">{form.descricao.length}/{MAX_DESC}</span>
            </div>

            <div>
              <label className="font-bold text-gray-700">Categoria</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORIAS_FIXAS.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    className={
                      "px-5 py-2 rounded-full text-base font-bold shadow cursor-pointer transition " +
                      (form.categoria === cat
                        ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-50")
                    }
                    onClick={() => handleCategoriaClick(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <label className="font-bold text-gray-700" htmlFor="preco">Preço (R$)</label>
                <input
                  id="preco"
                  name="preco"
                  type="text"
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg mt-1 text-base shadow-sm focus:ring-2 focus:ring-purple-300 outline-none"
                  placeholder="R$ 0,00"
                  value={form.preco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="font-bold text-gray-700" htmlFor="duracao">Duração (min)</label>
                <input
                  id="duracao"
                  name="duracao"
                  type="number"
                  min={1}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg mt-1 text-base shadow-sm focus:ring-2 focus:ring-purple-300 outline-none"
                  placeholder="30"
                  value={form.duracao}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Toggle ativo */}
            <div className="flex items-center justify-between mt-3">
              <label className="font-bold text-gray-700">Serviço ativo</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Disponível para agendamento</span>
                <button
                  type="button"
                  onClick={handleToggleAtivo}
                  aria-label="Ativar ou desativar serviço"
                  className="w-16 h-7 bg-gray-200 rounded-full border-2 border-gray-300 transition relative focus:ring-2 focus:ring-purple-300 outline-none cursor-pointer"
                  style={{
                    background: form.ativo ? "#a855f7" : "#e5e7eb",
                    borderColor: form.ativo ? "#a855f7" : "#e5e7eb",
                  }}
                >
                  <span
                    className={
                      "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform " +
                      (form.ativo ? "transform translate-x-4" : "")
                    }
                    style={{
                      transform: form.ativo ? "translateX(20px)" : "none",
                      transition: "transform 0.5s",
                    }}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button type="button" className="w-1/2 py-3 rounded-lg bg-gray-100 border border-gray-300 font-bold text-gray-700 hover:bg-red-200 transition shadow cursor-pointer" onClick={closeForm}>Cancelar</button>
              <button type="submit" className="w-1/2 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:brightness-105 text-white font-bold shadow transition cursor-pointer">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white px-7 py-10 rounded-2xl shadow-lg w-full max-w-[380px] flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-4 text-center">{popup.msg}</span>
            <div className="flex gap-4">
              {popup.ok ? (
                <>
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-105 shadow cursor-pointer" onClick={handlePopupSim}>Sim</button>
                  <button className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 shadow cursor-pointer" onClick={handlePopupOk}>Não</button>
                </>
              ) : (
                <button className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-105 shadow cursor-pointer" onClick={handlePopupOk}>Ok</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listagem de serviços */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 px-3 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Serviços cadastrados</h2>
        {servicosFiltrados.length === 0 && (
          <div className="text-gray-400 text-center my-10">Nenhum serviço encontrado.</div>
        )}
        {servicosFiltrados.map(serv => (
          <div
            key={serv.id}
            className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border border-gray-100 rounded-2xl py-5 px-5 shadow cursor-pointer bg-white transition-all group hover:bg-purple-50 hover:-translate-y-1 hover:shadow-2xl duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-bold text-xl text-gray-900">{serv.nome}</span>
                <span className={
                  "ml-3 px-3 py-1 rounded-full text-xs font-bold align-middle " +
                  (serv.ativo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500")
                }>
                  {serv.ativo ? "Ativo" : "Inativo"}
                </span>
                {/* Toggle ativo/inativo na lista */}
                <button
                  type="button"
                  aria-label={serv.ativo ? "Desativar serviço" : "Ativar serviço"}
                  onClick={() => handleToggleAtivoServico(serv.id)}
                  className="ml-5 w-16 h-8 bg-gray-200 rounded-full border-2 border-gray-300 transition relative focus:ring-2 focus:ring-purple-300 outline-none cursor-pointer align-middle"
                  style={{
                    background: serv.ativo ? "#a855f7" : "#e5e7eb",
                    borderColor: serv.ativo ? "#a855f7" : "#e5e7eb",
                    display: "inline-block",
                    verticalAlign: "middle"
                  }}
                >
                  <span
                    className={
                      "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform" +
                      (serv.ativo ? " transform translate-x-3" : "")
                    }
                    style={{
                      transform: serv.ativo ? "translateX(20px)" : "none",
                      transition: "transform 0.3s"
                    }}
                  />
                </button>
              </div>
              <div className="text-gray-500 font-medium text-base mt-1">{serv.descricao}</div>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-base font-bold">{serv.categoria}</span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-base font-bold">{serv.preco}</span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-base font-bold">
                  <AiOutlineClockCircle /> {serv.duracao} min
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:bg-purple-700 text-white font-bold rounded-lg py-2 px-4 transition flex items-center gap-2 shadow cursor-pointer"
                title="Atualizar"
                onClick={() => openForm(serv)}
              >
                <FiEdit size={18}/> Atualizar
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg py-2 px-4 transition flex items-center gap-2 shadow cursor-pointer"
                title="Excluir"
                onClick={() => handleExcluir(serv.id)}
              >
                <FiTrash2 size={18}/> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}