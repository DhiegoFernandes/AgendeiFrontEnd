import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../services/api";
import { CiImageOn } from "react-icons/ci";
import ModalPlanos from "../../components/ModalPlanos";
import type { TipoPlano } from "../../components/ModalPlanos";

export default function GerenciarPerfilParceiro() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [parceiroId, setParceiroId] = useState<number | null>(null);

  // Estado para foto de perfil
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  
  // Estados para modal de planos
  const [modalPlanosAberto, setModalPlanosAberto] = useState(false);
  const [planoAtual, setPlanoAtual] = useState<TipoPlano | undefined>(undefined);
  const [carregandoPlano, setCarregandoPlano] = useState(false);
  const [ehDono, setEhDono] = useState<boolean | null>(null);
  
  // useEffect para buscar dados do usuário
  useEffect(() => {
    async function buscarDadosParceiro() {
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
        setNome(user.nome || "");
        setEmail(user.email || "");
        setTelefone(user.telefone || "");
        setParceiroId(user.id);
        
        // Buscar plano atual diretamente da resposta
        if (user.plano) {
          setPlanoAtual(user.plano as TipoPlano);
        }

        // Verificar se é dono do negócio
        if (negocio && negocio.id) {
          // Tentar buscar informações do negócio para verificar se é dono
          try {
            await api.get(`/negocios/${negocio.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            });
            
            // Se conseguir buscar, provavelmente é dono ou tem acesso
            setEhDono(true);
          } catch (error: any) {
            // Se der erro 403 ou similar, não é dono
            if (error?.response?.status === 403 || error?.response?.status === 401) {
              setEhDono(false);
            } else {
              // Outro erro, tentar verificar de outra forma
              setEhDono(true); // Assumir que é dono por padrão, o backend vai validar
            }
          }
        }

        console.log("Dados do parceiro carregados:", user);

        // Buscar foto de perfil do prestador
        try {
          const fotoUrlResponse = await api.get(`/usuarios/${user.id}/foto-perfil-url`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          const fotoUrlData = fotoUrlResponse.data;
          
          // Se houver URL da foto, buscar a imagem
          if (fotoUrlData && fotoUrlData.urlFoto) {
            try {
              const fotoBlobResponse = await api.get(fotoUrlData.urlFoto, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              });

              // Converter blob para URL para exibição
              if (fotoBlobResponse.data && fotoBlobResponse.data.size > 0) {
                const imageUrl = URL.createObjectURL(fotoBlobResponse.data);
                setFotoPreview(imageUrl);
                console.log("Foto do prestador carregada com sucesso");
              }
            } catch (fotoBlobError) {
              console.log("Erro ao buscar foto do prestador:", fotoBlobError);
            }
          }
        } catch (fotoUrlError) {
          // Se não houver foto, simplesmente não definir fotoPreview (permanece null)
          console.log("Foto de perfil do prestador não encontrada ou indisponível");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do parceiro:", error);
      }
    }

    buscarDadosParceiro();
  }, []);

  // Formatação de telefone
  function formatarTelefone(valor: string) {
    // Remove tudo exceto números
    const numeros = valor.replace(/\D/g, "");
    
    if (numeros.length <= 2) {
      return numeros;
    } 
    
    if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }
    
    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  function handleTelefone(e: React.ChangeEvent<HTMLInputElement>) {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  }

  // Handler para foto de perfil
  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFoto(file);
    
    // Criar URL para preview
    const fileUrl = URL.createObjectURL(file);
    setFotoPreview(fileUrl);
  }
  
  function removerFoto() {
    setFoto(null);
    setFotoPreview(null);
    
    // Limpar input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Função para comprimir imagem
  function comprimirImagem(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
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

  // Função para atualizar dados do parceiro
  async function handleSubmitDados(e: React.FormEvent) {
    e.preventDefault();
    
    if (!parceiroId) {
      setPopupMessage("Erro: ID do parceiro não encontrado!");
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
      // Remover formatação do telefone (apenas números)
      const telefoneSemFormatacao = telefone.replace(/\D/g, "");
      
      const dadosAtualizacao = {
        nome: nome,
        email: email,
        telefone: telefoneSemFormatacao
      };

      await api.put(`/usuarios/me/atualizar`, dadosAtualizacao, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setPopupMessage("Dados do parceiro atualizados com sucesso!");
      setPopup(true);
      console.log("Dados do parceiro atualizados:", dadosAtualizacao);
    } catch (error) {
      console.error("Erro ao atualizar dados do parceiro:", error);
      setPopupMessage("Erro ao atualizar dados. Tente novamente.");
      setPopup(true);
    }
  }

  // Função para atualizar plano
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
    } catch (error: any) {
      console.error("Erro ao atualizar plano:", error);
      const errorMessage = error?.response?.data?.errorMessage || error?.response?.data?.message || error?.message || "Erro ao atualizar plano.";
      
      // Verificar se o erro indica que não é dono
      const errorMessageLower = errorMessage.toLowerCase();
      if (
        errorMessageLower.includes("dono") || 
        errorMessageLower.includes("proprietário") ||
        errorMessageLower.includes("owner") ||
        errorMessageLower.includes("permissão") ||
        errorMessageLower.includes("permissao") ||
        error?.response?.status === 403 ||
        error?.response?.status === 401
      ) {
        setEhDono(false);
        setPopupMessage("Apenas o dono do negócio pode alterar o plano.");
      } else {
        setPopupMessage(errorMessage);
      }
      setPopup(true);
    } finally {
      setCarregandoPlano(false);
    }
  }

  // Função para atualizar foto
  async function handleSubmitFoto(e: React.FormEvent) {
    e.preventDefault();
    
    if (!parceiroId) {
      setPopupMessage("Erro: ID do parceiro não encontrado!");
      setPopup(true);
      return;
    }

    if (!foto) {
      setPopupMessage("Selecione uma foto para enviar!");
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
      // Comprimir a imagem antes de enviar
      const fotoComprimida = await comprimirImagem(foto);
      
      const formData = new FormData();
      formData.append('arquivo', fotoComprimida);

      await api.put(`/usuarios/foto-perfil`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setPopupMessage("Foto de perfil atualizada com sucesso!");
      setPopup(true);
      console.log("Foto de perfil atualizada");
      
      // Recarregar a foto após atualização bem-sucedida
      if (parceiroId) {
        try {
          const fotoUrlResponse = await api.get(`/usuarios/${parceiroId}/foto-perfil-url`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          const fotoUrlData = fotoUrlResponse.data;
          
          if (fotoUrlData && fotoUrlData.urlFoto) {
            const fotoBlobResponse = await api.get(fotoUrlData.urlFoto, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob'
            });

            if (fotoBlobResponse.data && fotoBlobResponse.data.size > 0) {
              const imageUrl = URL.createObjectURL(fotoBlobResponse.data);
              setFotoPreview(imageUrl);
            }
          }
        } catch (error) {
          console.log("Erro ao recarregar foto após atualização:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setPopupMessage("Erro ao atualizar foto de perfil. Tente novamente.");
      setPopup(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center pb-10">
      {/* Navbar */}
      <Header />

      {/* Container dos Cards */}
      <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4 w-full max-w-6xl mx-auto">
        {/* Card de Dados do Parceiro */}
        <form 
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitDados} 
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Dados do Parceiro</h2>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeParceiro">
              Nome completo
            </label>
            <input
              id="nomeParceiro"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="emailParceiro">
              E-mail
            </label>
            <input
              id="emailParceiro"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="telefoneParceiro">
              Telefone
            </label>
            <input
              id="telefoneParceiro"
              value={telefone}
              onChange={handleTelefone}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Informe apenas números</p>
          </div>
          
          {/* Botão de atualizar plano */}
          {ehDono === false && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Apenas o dono do negócio pode alterar o plano.
              </p>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => {
              if (ehDono === false) {
                setPopupMessage("Apenas o dono do negócio pode alterar o plano.");
                setPopup(true);
              } else {
                setModalPlanosAberto(true);
              }
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={ehDono === false}
          >
            {planoAtual ? `Plano Atual: ${planoAtual === "BASICO" ? "Básico" : planoAtual === "INTERMEDIARIO" ? "Intermediário" : "Avançado"}` : "Mudar Plano"}
          </button>
          
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-auto"
            type="submit"
          >
            Atualizar dados
          </button>
          
          {/* Botão de redefinir senha */}
          <button
            type="button"
            onClick={() => navigate("/esqueceuSenha")}
            className="w-full bg-transparent border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-bold text-lg shadow-sm hover:bg-purple-50 transition cursor-pointer"
          >
            Redefinir senha
          </button>
        </form>
        
        {/* Card de Foto do Parceiro */}
        <form 
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitFoto} 
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Foto do Parceiro</h2>
          
          <div className="flex-1">
            <label className="block font-bold text-gray-700 mb-1" htmlFor="fotoParceiro">
              Atualizar foto de perfil
            </label>
            <input
              ref={fileInputRef}
              id="fotoParceiro"
              type="file"
              accept="image/*"
              onChange={handleFoto}
              className="w-full rounded-lg border-2 border-purple-200 bg-white py-1.5 px-2.5 shadow-sm cursor-pointer text-base mb-2"
            />
            
            <div className="flex justify-center mt-6">
              {fotoPreview ? (
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-200 shadow-md">
                    <img
                      src={fotoPreview}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={removerFoto}
                    className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 hover:bg-red-500 transition shadow cursor-pointer text-xs"
                    tabIndex={0}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100 text-gray-400">
                  <CiImageOn size={80} className="text-gray-400" />

                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-bold text-purple-800">Dicas para foto de perfil:</h3>
              <ul className="text-xs text-purple-700 mt-1 list-disc pl-5">
                <li>Use uma foto bem iluminada e nítida</li>
                <li>Certifique-se que esteja com boa qualidade</li>
                <li>Um fundo neutro ajuda a destacar seu perfil</li>
              </ul>
            </div>
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!foto}
          >
            Atualizar foto
          </button>
        </form>
      </div>
      
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

      {/* Modal de Planos */}
      <ModalPlanos
        isOpen={modalPlanosAberto}
        onClose={() => setModalPlanosAberto(false)}
        onSelecionarPlano={handleAtualizarPlano}
        planoAtual={planoAtual}
        carregando={carregandoPlano}
      />
    </div>
  );
}