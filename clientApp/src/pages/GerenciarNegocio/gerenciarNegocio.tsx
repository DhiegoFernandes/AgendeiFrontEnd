import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../services/api";
import { HiOutlineLogout } from "react-icons/hi";
import ModalVisualizarFotos from "../../components/ModalVisualizarFotos";

const CATEGORIAS_FIXAS = ["BELEZA", "ESTETICA", "SAUDE", "FITNESS", "BARBEARIA", "MAQUIAGEM", "MANICURE", "SPA", "OUTROS"];

export default function GerenciarNegocio() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [negocioId, setNegocioId] = useState<number | null>(null);

  // Estado para modal de confirmação de sair do negócio
  const [modalSairNegocio, setModalSairNegocio] = useState(false);

  // Estado para modal de erro com opção de tentar outra rota
  const [modalErroRota, setModalErroRota] = useState(false);
  const [mensagemErroRota, setMensagemErroRota] = useState("");

  // Estados para fotos
  const [fotos, setFotos] = useState<File[]>([]);

  // Estado para modal de visualizar fotos
  const [modalVisualizarFotos, setModalVisualizarFotos] = useState(false);

  // useEffect para buscar dados do usuário e obter ID do negócio
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

        const user = response.data;
        const negocio = user.negocio;

        // Atualizar os dados do formulário com os dados reais
        setNome(negocio.nome);
        setCep(negocio.cep);
        setEndereco(negocio.endereco);
        setNumero(negocio.numero);
        setCategoria(negocio.categoria);
        setNegocioId(negocio.id);

        console.log("Dados do usuário carregados:", user);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    buscarDadosUsuario();
  }, []);

  // Handler fotos
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    let newFiles = Array.from(e.target.files);
    if (fotos.length + newFiles.length > 10) newFiles = newFiles.slice(0, 10 - fotos.length);
    setFotos(prev => [...prev, ...newFiles]);
  }

  function removeFoto(idx: number) {
    setFotos(list => list.filter((_, i) => i !== idx));
  }

  // Função para comprimir imagens
  function comprimirImagem(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Converter para blob com qualidade especificada
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Erro ao comprimir imagem'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Função para atualizar dados do negócio
  async function handleSubmitDados(e: React.FormEvent) {
    e.preventDefault();

    if (!negocioId) {
      setPopupMessage("Erro: ID do negócio não encontrado!");
      setPopup(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPopupMessage("Erro: Token de autenticação não encontrado!");
      setPopup(true);
      return;
    }

    try {
      const dadosAtualizacao = {
        nome: nome,
        categoria: categoria
      };

      await api.put(`/negocios/${negocioId}`, dadosAtualizacao, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setPopupMessage("Dados do negócio atualizados com sucesso!");
      setPopup(true);
      console.log("Dados do negócio atualizados:", dadosAtualizacao);
    } catch (error: any) {
      console.error("Erro ao atualizar dados do negócio:", error);

      const backendMessage = error?.response?.data?.errorMessage || error?.message || "";

      // Tratar mensagens específicas do backend
      if (backendMessage.includes("Você não tem permissão")) {
        setPopupMessage("Apenas o dono pode alterar informações do negócio.");
      } else if (backendMessage.includes("Não é possível atualizar um negócio inativo")) {
        setPopupMessage("Não é possível atualizar um negócio inativo.");
      } else if (backendMessage.includes("Nome do negócio já está em uso")) {
        setPopupMessage("Este nome de negócio já está em uso. Escolha outro.");
      } else if (backendMessage.includes("Prestadores só podem alterar o nome e a categoria")) {
        setPopupMessage("Você só pode alterar o nome e a categoria do negócio.");
      } else {
        setPopupMessage("Erro ao atualizar dados do negócio. Tente novamente.");
      }

      setPopup(true);
    }
  }

  // Função para sair do negócio (tenta rota do dono primeiro)
  async function handleSairNegocio() {
    if (!negocioId) {
      setPopupMessage("Erro: ID do negócio não encontrado!");
      setPopup(true);
      setModalSairNegocio(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPopupMessage("Erro: Token de autenticação não encontrado!");
      setPopup(true);
      setModalSairNegocio(false);
      return;
    }

    setModalSairNegocio(false);

    try {
      // Primeira tentativa: rota do dono (DELETE /negocios/{id})
      await api.delete(`/negocios/${negocioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Sucesso na rota do dono
      setPopupMessage("Você saiu do negócio com sucesso!");
      setPopup(true);

      // Redirecionar após um tempo
      setTimeout(() => {
        navigate("/prestador/criar-negocio");
      }, 2000);
    } catch (error: any) {
      // Verificar se o erro indica que não é o dono
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "";
      const errorMessageLower = errorMessage.toLowerCase();

      // Se a mensagem de erro indica que precisa usar a rota de convidado
      // Verifica várias possíveis variações da mensagem
      if (
        errorMessageLower.includes("dono") ||
        errorMessageLower.includes("excluí-lo") ||
        errorMessageLower.includes("proprietário") ||
        errorMessageLower.includes("owner") ||
        errorMessageLower.includes("não pode excluir") ||
        errorMessageLower.includes("não pode excluí-lo") ||
        error?.response?.status === 403 ||
        error?.response?.status === 401
      ) {
        // Mostrar modal perguntando se quer tentar a rota de convidado
        setMensagemErroRota(errorMessage || "Você não tem permissão para excluir este negócio.");
        setModalErroRota(true);
      } else {
        // Outro tipo de erro
        console.error("Erro ao sair do negócio:", error);
        setPopupMessage(errorMessage || "Erro ao sair do negócio. Tente novamente.");
        setPopup(true);
      }
    }
  }

  // Função para tentar sair usando a rota de convidado
  async function handleSairComoConvidado() {
    const token = localStorage.getItem("token");
    if (!token) {
      setPopupMessage("Erro: Token de autenticação não encontrado!");
      setPopup(true);
      setModalErroRota(false);
      return;
    }

    try {
      // Segunda tentativa: rota de convidado (DELETE /negocios/sair)
      await api.delete(`/negocios/sair`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setModalErroRota(false);
      setPopupMessage("Você saiu do negócio com sucesso!");
      setPopup(true);

      // Redirecionar após um tempo
      setTimeout(() => {
        navigate("/prestador/criar-negocio");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao sair do negócio (rota convidado):", error);
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "";
      setPopupMessage(errorMessage || "Erro ao sair do negócio. Tente novamente.");
      setPopup(true);
      setModalErroRota(false);
    }
  }

  // Função para atualizar fotos
  async function handleSubmitFotos(e: React.FormEvent) {
    e.preventDefault();

    if (!negocioId) {
      setPopupMessage("Erro: ID do negócio não encontrado!");
      setPopup(true);
      return;
    }

    if (fotos.length === 0) {
      setPopupMessage("Selecione pelo menos uma foto para enviar!");
      setPopup(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPopupMessage("Erro: Token de autenticação não encontrado!");
      setPopup(true);
      return;
    }

    try {
      // Comprimir e enviar cada foto individualmente
      const uploadPromises = fotos.map(async (foto) => {
        // Comprimir a imagem antes de enviar
        const fotoComprimida = await comprimirImagem(foto);

        const formData = new FormData();
        formData.append('arquivo', fotoComprimida);

        const response = await api.post(`/negocios/${negocioId}/fotos`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        return response;
      });

      // Aguardar todos os uploads
      await Promise.all(uploadPromises);

      setPopupMessage(`${fotos.length} foto(s) adicionada(s) com sucesso!`);
      setPopup(true);

      // Limpar as fotos após upload bem-sucedido
      setFotos([]);

      console.log(`${fotos.length} fotos enviadas com sucesso`);
    } catch (error: any) {
      console.error("Erro ao enviar fotos:", error);

      const backendMessage = error?.response?.data?.errorMessage || error?.message || "";

      // Verifica as mensagens que você enviou do backend
      if (backendMessage.includes("Apenas o dono do negócio pode adicionar fotos")) {
        setPopupMessage("Apenas o dono do negócio pode adicionar fotos.");
      } else {
        setPopupMessage("Erro ao enviar fotos. Tente novamente.");
      }

      setPopup(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center pb-10">
      {/* Navbar */}
      <Header />

      {/* Container dos Cards */}
      <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4 w-full max-w-6xl mx-auto">
        {/* Card de Atualizar Dados do Negócio */}
        <form
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitDados}
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Dados do Negócio</h2>

          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeNegocio">
              Nome do negócio
            </label>
            <input
              id="nomeNegocio"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome do negócio"
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
              maxLength={9}
              className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-base shadow-sm outline-none cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">O CEP não pode ser alterado</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoNegocio">
              Endereço
            </label>
            <input
              id="enderecoNegocio"
              value={`${endereco}${numero ? `, ${numero}` : ''}`}
              className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-base shadow-sm outline-none cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">O endereço não pode ser alterado</p>
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

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-auto"
            type="submit"
          >
            Atualizar dados
          </button>
        </form>

        {/* Card de Atualizar Fotos */}
        <form
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitFotos}
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Fotos do Negócio</h2>

          <div className="flex-1">
            <label className="block font-bold text-gray-700 mb-1" htmlFor="fotosNegocio">
              Adicionar novas fotos <span className="text-gray-400 font-normal text-xs">(máx. 10)</span>
            </label>
            <input
              ref={fileInputRef}
              id="fotosNegocio"
              type="file"
              accept="image/*"
              multiple
              max={10}
              onChange={handleFiles}
              className="w-full rounded-lg border-2 border-purple-200 bg-white py-1.5 px-2.5 shadow-sm cursor-pointer text-base mb-2"
              disabled={fotos.length >= 10}
            />

            {fotos.length === 0 ? (
              <div className="mt-4 bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">Nenhuma foto selecionada</p>
                <p className="text-sm text-gray-400 mt-2">Selecione fotos para visualizar aqui</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-4">
                {fotos.map((file, idx) =>
                  <div key={idx} className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFoto(idx)}
                      className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 hover:bg-red-500 transition shadow cursor-pointer text-xs"
                      tabIndex={0}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {fotos.length >= 10 && (
              <p className="text-xs text-red-500 font-bold mt-2">
                Limite de 10 fotos atingido.
              </p>
            )}

            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-bold text-purple-800">Dicas para fotos:</h3>
              <ul className="text-xs text-purple-700 mt-1 list-disc pl-5">
                <li>Use fotos bem iluminadas e nítidas</li>
                <li>Mostre o ambiente do seu negócio</li>
                <li>Inclua fotos dos serviços realizados</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer"
              type="button"
              onClick={() => setModalVisualizarFotos(true)}
            >
              Visualizar fotos
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={fotos.length === 0}
            >
              Atualizar fotos
            </button>
          </div>
        </form>
      </div>

      {/* Botão de Sair do Negócio */}
      <div className="w-full max-w-6xl mx-auto px-4 mt-6">
        <button
          className="flex items-center gap-2 py-3 px-7 rounded-xl border-2 border-red-300 text-red-600 font-bold bg-white hover:bg-red-50 transition text-lg shadow cursor-pointer"
          onClick={() => setModalSairNegocio(true)}
        >
          <HiOutlineLogout size={20} />
          Sair do negócio
        </button>
      </div>

      {/* Modal de confirmação para sair do negócio */}
      {modalSairNegocio && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Sair do negócio?
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Tem certeza que deseja sair deste negócio? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition cursor-pointer"
                onClick={() => setModalSairNegocio(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                onClick={handleSairNegocio}
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de erro com opção de tentar outra rota */}
      {modalErroRota && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Não autorizado
            </h3>
            <p className="text-gray-600 mb-2 text-center">
              {mensagemErroRota}
            </p>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Deseja tentar sair do negócio como convidado?
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition cursor-pointer"
                onClick={() => setModalErroRota(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer"
                onClick={handleSairComoConvidado}
              >
                Sim, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualizar fotos */}
      <ModalVisualizarFotos
        negocioId={negocioId}
        isOpen={modalVisualizarFotos}
        onClose={() => setModalVisualizarFotos(false)}
      />

      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              {popupMessage}
            </span>
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