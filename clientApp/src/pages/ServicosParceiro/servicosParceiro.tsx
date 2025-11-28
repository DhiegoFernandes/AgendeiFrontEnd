import { useState, useEffect } from "react";
import {
  FiPlus, FiEdit, FiX, FiArrowLeft
} from "react-icons/fi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../../components/Header";


function currencyMask(value: string) {
  let v = value.replace(/\D/g, "");
  v = (Number(v) / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  return "R$ " + v;
}

export default function ServicosParceiro() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    id: null as number | null,
    nome: "",
    descricao: "",
    preco: "",
    duracao: "",
    ativo: true,
  });
  const [popup, setPopup] = useState<{ msg: string, ok?: () => void } | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_NOME = 50;
  const MAX_DESC = 200;

  // Função para carregar serviços da API
  async function carregarServicos() {
    const token = localStorage.getItem("token");

    if (!token) {
      setPopup({ msg: "Token de autenticação não encontrado!" });
      return;
    }

    setLoading(true);
    try {
      // Primeiro, buscar dados do usuário para obter o ID do negócio
      const userResponse = await api.get('/usuarios/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = userResponse.data;
      const negocioId = userData.negocio?.id;

      if (!negocioId) {
        setPopup({ msg: "Negócio não encontrado. Verifique se você tem um negócio cadastrado." });
        return;
      }

      // Agora buscar os serviços do negócio específico
      const response = await api.get(`/servicos/negocio/${negocioId}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Transformar dados da API para o formato local
      const servicosFormatados = response.data.map((servico: any) => ({
        id: servico.id,
        nome: servico.titulo,
        descricao: servico.descricao,
        preco: `R$ ${servico.valor.toFixed(2).replace('.', ',')}`,
        duracao: servico.duracaoMinutos,
        ativo: servico.ativo,
        nomePrestador: servico.nomePrestador
      }));

      setServicos(servicosFormatados);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setPopup({ msg: "Erro ao carregar serviços. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  // Carregar serviços ao montar o componente
  useEffect(() => {
    carregarServicos();
  }, []);

  function openForm(serv?: typeof form) {
    setForm(serv
      ? { ...serv }
      : { id: null, nome: "", descricao: "", preco: "", duracao: "", ativo: true }
    );
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setForm({ id: null, nome: "", descricao: "", preco: "", duracao: "", ativo: true });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "preco" ? currencyMask(value) : value
    }));
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome.trim() || !form.preco) {
      setPopup({ msg: "Preencha os campos obrigatórios!" });
      return;
    }

    // Validar descrição
    if (!form.descricao.trim()) {
      setPopup({ msg: "A descrição do serviço é obrigatória. Por favor, preencha este campo." });
      return;
    }


    // Validar duração
    if (!form.duracao || Number(form.duracao) <= 0) {
      setPopup({ msg: "Informe a duração do serviço." });
      return;
    }

    // Validar duração mínima
    const duracaoNum = Number(form.duracao);
    if (isNaN(duracaoNum) || duracaoNum < 5) {
      setPopup({ msg: "A duração do serviço deve ser de no mínimo 5 minutos." });
      return;
    }

    // Validar duração máxima
    if (duracaoNum > 480) {
      setPopup({ msg: "A duração máxima de um serviço é de 8 horas (480 minutos)." });
      return;
    }


    // Validar preço
    const valor = parseFloat(
      form.preco
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );

    if (isNaN(valor) || valor <= 0) {
      setPopup({ msg: "Informe um valor válido para o serviço." });
      return;
    }

    if (valor > 5000) {
      setPopup({ msg: "O valor máximo permitido para um serviço é de R$ 5000,00." });
      return;
    }


    // Preparar dados para envio
    const dataToPost = {
      titulo: form.nome,
      descricao: form.descricao,
      valor: parseFloat(
        form.preco
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      ),
      duracaoMinutos: Number(form.duracao),
      ativo: form.ativo
    };

    const token = localStorage.getItem("token");

    if (!token) {
      setPopup({ msg: "Token de autenticação não encontrado!" });
      return;
    }

    try {
      let response;

      if (form.id !== null && form.id !== undefined) {
        // Atualizar serviço existente
        response = await api.put(`/servicos/${form.id}`, dataToPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Criar novo serviço
        response = await api.post('/servicos', dataToPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      console.log(`Serviço ${form.id ? "atualizado" : "cadastrado"} com sucesso:`, response.data);

      // Recarregar lista de serviços da API
      await carregarServicos();

      closeForm();
      setTimeout(() => setPopup({ msg: `Serviço ${form.id ? "atualizado" : "cadastrado"} com sucesso!` }), 100);

    } catch (error: any) {
      console.error('Erro ao salvar serviço:', error);

      const backendMessage = error?.response?.data?.errorMessage
        || error?.response?.data?.message
        || "";

      if (backendMessage.includes("Você não tem permissão para editar")) {
        setPopup({ msg: "Apenas o dono do serviço pode estar alterando o serviço." });
        return;
      }

      if (backendMessage.includes("Prestador não está associado a um negócio")) {
        setPopup({ msg: "Você não está associado a um negócio. Crie ou entre para um negócio antes de cadastrar serviços." });
        return;
      }

      if (backendMessage.includes("duração máxima")) {
        setPopup({ msg: "A duração máxima de um serviço é de 8 horas (480 minutos)." });
        return;
      }

      if (backendMessage.includes("valor máximo")) {
        setPopup({ msg: "O valor máximo permitido é de R$ 5000,00." });
        return;
      }

      if (backendMessage.includes("Já existe um serviço com esse título")) {
        setPopup({ msg: "Já existe um serviço com esse nome no seu negócio." });
        return;
      }

      if (backendMessage.includes("não está associado a um negócio")) {
        setPopup({ msg: "Você precisa estar em um negócio para criar serviços." });
        return;
      }

      if (backendMessage.includes("Não é possível alterar a duração deste serviço pois")) {
        setPopup({ msg: "Não é possível alterar a duração deste serviço pois existem agendamentos pendentes." });
        return;
      }


      // fallback
      setPopup({ msg: "Erro ao salvar serviço. Tente novamente." });
    }

  }


  async function toggleAtivoServico(id: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setPopup({ msg: "Token de autenticação não encontrado!" });
      return;
    }

    const servico = servicos.find(s => s.id === id);
    if (!servico) return;

    const novoStatus = !servico.ativo;

    try {
      await api.put(`/servicos/${id}`, {
        titulo: servico.nome,
        descricao: servico.descricao,
        valor: parseFloat(
          servico.preco
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
        ),
        duracaoMinutos: servico.duracao,
        ativo: novoStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status do serviço atualizado com sucesso');

      // Recarregar lista de serviços da API
      await carregarServicos();
    } catch (error) {
      console.error('Erro ao atualizar status do serviço:', error);
      setPopup({ msg: "Erro ao atualizar status do serviço. Tente novamente." });
    }
  }

  function handleToggleAtivoServico(id: number) {
    toggleAtivoServico(id);
  }

  function handleToggleAtivo() {
    setForm(f => ({ ...f, ativo: !f.ativo }));
  }

  const servicosFiltrados = servicos;

  function handlePopupOk() { setPopup(null); }
  function handlePopupSim() { popup?.ok?.(); setPopup(null); }

  const modalClass = "bg-white max-w-md w-full p-4 sm:p-7 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-y-auto max-h-[94vh] animate-fadeIn";

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-14">
      {/* Navbar moderna */}
      <
        Header
      />

      <div className="max-w-2xl mx-auto flex justify-end mb-4 px-2 mt-5">
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
              <label className="font-bold text-gray-700" htmlFor="descricao">Descrição</label>
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
        {loading && (
          <div className="text-purple-600 text-center my-10">Carregando serviços...</div>
        )}
        {!loading && servicosFiltrados.length === 0 && (
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
              <div className="mt-2 flex flex-col gap-2">
                {/* Descrição do serviço */}
                <p className="text-gray-700 text-base font-medium line-clamp-2">
                  {serv.descricao}
                </p>

                {/* Prestador */}
                <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A9.002 9.002 0 0112 15a9.002 9.002 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{serv.nomePrestador}</span>
                </div>

                {/* Informações adicionais */}
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                    {serv.preco}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-bold">
                    <AiOutlineClockCircle /> {serv.duracao} min
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:bg-purple-700 text-white font-bold rounded-lg py-2 px-4 transition flex items-center gap-2 shadow cursor-pointer"
                title="Atualizar"
                onClick={() => openForm(serv)}
              >
                <FiEdit size={18} /> Atualizar
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}