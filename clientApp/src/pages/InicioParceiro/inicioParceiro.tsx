import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ModalPlanos from "../../components/ModalPlanos";
import type { TipoPlano } from "../../components/ModalPlanos";

const PRESTADOR_NOME = localStorage.getItem("nome");
const CATEGORIAS_FIXAS = [
    "BELEZA",
    "ESTETICA",
    "SAUDE",
    "FITNESS",
    "BARBEARIA",
    "MAQUIAGEM",
    "MANICURE",
    "SPA",
    "OUTROS"
];

export default function PrimeiroAcessoNegocio() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_FIXAS[0]);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [negocioCriado, setNegocioCriado] = useState(false);
  const [parceiroId, setParceiroId] = useState<number | null>(null);
  
  // Estados para modal de planos
  const [modalPlanosAberto, setModalPlanosAberto] = useState(false);
  const [planoAtual, setPlanoAtual] = useState<TipoPlano | undefined>(undefined);
  const [carregandoPlano, setCarregandoPlano] = useState(false);

  useEffect(() => {
    async function buscarDadosUsuario() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const dados = response.data;
        setParceiroId(dados.id);

        if (dados.negocio) {
          navigate("/parceiro/perfil")
        }

        console.log("Usuário carregado:", dados);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    buscarDadosUsuario();
  }, [])

  const enderecoRef = useRef<HTMLInputElement>(null);

  function handleCep(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  async function buscarEnderecoPorCep() {
    const soNumeros = cep.replace(/\D/g, "");
    if (soNumeros.length !== 8) return;
    setEndereco("Buscando...");
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${soNumeros}/json/`);
      const data = await resp.json();
      if (data.erro) {
        setEndereco("");
        alert("CEP não encontrado!");
      } else {
        setEndereco(data.logradouro || "");
        setTimeout(() => enderecoRef.current?.focus(), 180);
      }
    } catch {
      setEndereco("");
      alert("Erro ao buscar CEP!");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token")
    
    try{
      const dataToPost ={
        nome,
        cep,
        endereco,
        numero,
        categoria
      }

      const response = await api.post("/negocios", dataToPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

      // Após criar o negócio, abrir modal de planos
      setNegocioCriado(true);
      setModalPlanosAberto(true);

      console.log(response)
    } catch (error){
      console.log(error)
      setPopupMessage("Erro ao criar negócio. Tente novamente.");
      setPopup(true);
    }
  }

  // Função para atualizar plano (similar ao gerenciarPerfilParceiro)
  async function handleAtualizarPlano(novoPlano: TipoPlano) {
    if (!parceiroId) {
      setPopupMessage("Erro: ID do parceiro não encontrado!");
      setPopup(true);
      setModalPlanosAberto(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPopupMessage("Erro: Token de autenticação não encontrado!");
      setPopup(true);
      setModalPlanosAberto(false);
      return;
    }

    setCarregandoPlano(true);

    try {
      await api.put(`/prestadores/${parceiroId}/plano?novoPlano=${novoPlano}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setPlanoAtual(novoPlano);
      setPopupMessage("Plano atualizado com sucesso!");
      setPopup(true);
      setModalPlanosAberto(false);
      console.log("Plano atualizado para:", novoPlano);
      
      // Redirecionar para o perfil após escolher o plano
      setTimeout(() => {
        navigate("/parceiro/perfil");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao atualizar plano:", error);
      const errorMessage = error?.response?.data?.errorMessage || error?.response?.data?.message || error?.message || "Erro ao atualizar plano.";
      setPopupMessage(errorMessage);
      setPopup(true);
    } finally {
      setCarregandoPlano(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f5fb] px-3">
      <div className="w-full max-w-md flex flex-col items-center mb-2">
        <h2 className="text-[1.9rem] font-extrabold mb-1 text-center text-gray-800">
          Olá {PRESTADOR_NOME},<br />
          Seja bem-vindo ao{" "}
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-500 font-extrabold align-baseline select-none drop-shadow">
            Agend
          </span>
          <span className="text-orange-500" style={{ fontFamily: "inherit", fontWeight: 900 }}>ei</span>.
        </h2>
        <p className="text-center text-gray-500 text-base mb-6 font-medium">
          Crie seu negócio para começar a atender clientes.
        </p>
      </div>

      <form
        className="w-full max-w-sm rounded-2xl shadow-2xl bg-white py-8 px-7 flex flex-col gap-5 mb-5"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Criar negócio
        </h3>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeNegocio">
            Nome do comércio
          </label>
          <input
            id="nomeNegocio"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Digite o nome do comércio"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="cepNegocio">
            CEP
          </label>
          <input
            id="cepNegocio"
            value={cep}
            onChange={handleCep}
            onBlur={buscarEnderecoPorCep}
            maxLength={9}
            placeholder="Digite o CEP"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoNegocio">
            Endereço
          </label>
          <input
            id="enderecoNegocio"
            ref={enderecoRef}
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            placeholder="Rua preenchida automaticamente pelo CEP"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="numeroNegocio">
            Número
          </label>
          <input
            id="numeroNegocio"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            placeholder="Ex: 123"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="categoriaNegocio">
            Categoria
          </label>
          <select
            id="categoriaNegocio"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg bg-white text-base focus:ring-2 focus:ring-purple-400 outline-none"
            required
          >
            {CATEGORIAS_FIXAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer text-base"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 rounded-lg text-white font-bold bg-gradient-to-r from-purple-600 to-purple-700 hover:brightness-110 shadow transition cursor-pointer text-base"
          >
            Criar negócio
          </button>
        </div>
      </form>

      {/* Popup confirmação cancelar */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-9 py-8 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <span className="text-base font-bold text-purple-700 mb-4 text-center">
              Deseja cancelar o cadastro do negócio?
            </span>
            <div className="flex gap-4">
              <button
                className="px-8 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-red-300 hover:text-white transition cursor-pointer"
                onClick={() => setConfirmCancel(false)}
              >Não</button>
              <button
                className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
                onClick={() => navigate("/")}
              >Sim</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup mensagem */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{popupMessage || "Negócio cadastrado com sucesso!"}</span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => {
                setPopup(false);
                if (negocioCriado && !modalPlanosAberto) {
                  // Se o negócio foi criado mas o modal não está aberto, redirecionar
                  navigate("/parceiro/perfil");
                }
              }}
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* Modal de Planos - aparece após criar o negócio */}
      {negocioCriado && (
        <ModalPlanos
          isOpen={modalPlanosAberto}
          onClose={() => {
            setModalPlanosAberto(false);
            // Se fechar sem escolher, redirecionar mesmo assim
            navigate("/parceiro/perfil");
          }}
          onSelecionarPlano={handleAtualizarPlano}
          planoAtual={planoAtual}
          carregando={carregandoPlano}
        />
      )}
    </div>
  );
}