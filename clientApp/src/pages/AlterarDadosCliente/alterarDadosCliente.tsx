import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar";
import api from "../../services/api";
import { FiArrowLeft } from "react-icons/fi";

interface UserData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
  cep: string;
  endereco: string;
  numero: string;
}

type PopupType = { mensagem: string; acaoSim?: () => void; soOk?: boolean };

function validarNome(nome: string) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ ]{3,}$/.test(nome.trim());
}

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


export default function AlterarDadosCliente() {
  const navigate = useNavigate();
  // States dos campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [popup, setPopup] = useState<null | PopupType>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  //validacao
  const [cepValido, setCepValido] = useState(true);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [nomeValido, setNomeValido] = useState(true);
  const [emailValido, setEmailValido] = useState(true);


  const enderecoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function buscarDadosUsuario() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const userData: UserData = response.data;

        // Preencher os campos com os dados do usuário
        setNome(userData.nome || "");
        setEmail(userData.email || "");

        // Formatar telefone
        const telefoneFormatado = formatarTelefone(userData.telefone || "");
        setCelular(telefoneFormatado);

        // Formatar CEP
        const cepFormatado = formatarCep(userData.cep || "");
        setCep(cepFormatado);

        // Separar endereço e número
        setEndereco(userData.endereco || "");
        setNumero(userData.numero || "");

        console.log("Dados do usuário carregados:", userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarDadosUsuario();
  }, []);

  // Função auxiliar para formatar telefone
  function formatarTelefone(telefone: string) {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  // Função auxiliar para formatar CEP
  function formatarCep(cep: string) {
    const numeros = cep.replace(/\D/g, "");
    if (numeros.length === 8) {
      return numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cep;
  }

  // Máscara para celular
  function handleCelular(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    setCelular(v.slice(0, 15));
  }

  // Máscara CEP
  function handleCep(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  // Busca ViaCEP
  async function buscarCep() {
    const apenasNum = cep.replace(/\D/g, "");

    // Só busca se tiver 8 dígitos
    if (apenasNum.length !== 8) {
      setCepValido(false);
      return;
    }

    setBuscandoCep(true);
    setCepValido(true);
    setEndereco("Buscando...");

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${apenasNum}/json/`);
      const data = await resp.json();

      if (data.erro) {
        setEndereco("");
        setCepValido(false);
        setPopup({
          mensagem: "CEP não encontrado.",
          soOk: true
        });

      } else {
        setEndereco(data.logradouro || "");
        setCepValido(true);

        // Focar para permitir complemento
        setTimeout(() => enderecoRef.current?.focus(), 100);
      }
    } catch {
      setEndereco("");
      setCepValido(false);
      setPopup({
        mensagem: "Erro ao buscar CEP. Tente novamente.",
        soOk: true
      });

    }

    setBuscandoCep(false);
  }


  // Botão submit
  async function onSalvar(e: React.FormEvent) {
    e.preventDefault();


    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({
        mensagem: "Erro: Token de autenticação não encontrado!",
        soOk: true
      });
      return;
    }


    if (!validarNome(nome)) {
      setPopup({
        mensagem: "Nome inválido. Use pelo menos 3 letras e sem números.",
        soOk: true
      });
      return;
    }

    if (!validarEmail(email)) {
      setPopup({
        mensagem: "E-mail inválido. Digite um e-mail válido.",
        soOk: true
      });
      return;
    }

    if (buscandoCep) {
      setPopup({
        mensagem: "Aguarde a busca do CEP finalizar.",
        soOk: true
      });
      return;
    }

    if (!cepValido) {
      setPopup({
        mensagem: "CEP inválido. Corrija antes de salvar.",
        soOk: true
      });
      return;
    }

    if (endereco.trim() === "" || endereco === "Buscando...") {
      setPopup({
        mensagem: "Endereço inválido. Preencha um endereço válido.",
        soOk: true
      });
      return;
    }

    setPopup({
      mensagem: "Deseja salvar as alterações?",
      acaoSim: async () => {
        setSalvando(true);
        try {
          // Remover formatação do telefone e CEP
          const telefoneLimpo = celular.replace(/\D/g, "");
          const cepLimpo = cep.replace(/\D/g, "");

          const dataToPatch = {
            nome,
            email,
            telefone: telefoneLimpo,
            cep: cepLimpo,
            endereco,
            numero
          };

          await api.patch("/usuarios/cliente", dataToPatch, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          setPopup({
            mensagem: "Alterações salvas com sucesso!",
            acaoSim: () => navigate("/cliente/perfil"),
            soOk: true
          });
        } catch (error: any) {
          console.error("Erro ao atualizar dados:", error);
          const errorMessage = error?.response?.data?.errorMessage ||
            error?.response?.data?.message ||
            error?.message ||
            "Erro ao atualizar dados. Tente novamente.";
          setPopup({
            mensagem: errorMessage,
            soOk: true
          });
        } finally {
          setSalvando(false);
        }
      }
    });
  }

  // Botão voltar 
  function onVoltarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setPopup({
      mensagem: "Deseja descartar as alterações e voltar ao perfil?",
      acaoSim: () => navigate("/cliente/perfil"),
      soOk: false
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center">
        <div className="text-purple-600 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header */}
      <ClientNavbar />

      {/* Card */}
      <main className="flex-1 w-full flex flex-col items-center mt-5">
        <section className="bg-white max-w-md w-full rounded-2xl shadow-xl px-7 py-8 flex flex-col items-center gap-2 mb-8">

          <div className="w-full flex items-center mb-4">
            <button
              type="button"
              onClick={onVoltarPerfil}
              className="flex items-center text-purple-600 hover:text-purple-800 font-semibold transition"
            >
              <FiArrowLeft className="mr-2 text-lg" />
              Voltar
            </button>
          </div>

          <form className="w-full flex flex-col gap-4" autoComplete="off" onSubmit={onSalvar}>
            {/* Nome */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="full-name">Nome completo</label>
              <input
                type="text"
                id="full-name"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setNomeValido(validarNome(e.target.value));
                }}
                className={`w-full border rounded-lg px-4 py-2 text-base shadow-sm 
    ${nomeValido ? "border-gray-300" : "border-red-500"}`}
                required
              />
              {!nomeValido && (
                <p className="text-red-500 text-sm mt-1">
                  O nome deve ter pelo menos 3 letras e não conter números.
                </p>
              )}

            </div>
            {/* Email */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValido(validarEmail(e.target.value));
                }}
                className={`w-full border rounded-lg px-4 py-2 text-base shadow-sm 
    ${emailValido ? "border-gray-300" : "border-red-500"}`}
                required
              />
              {!emailValido && (
                <p className="text-red-500 text-sm mt-1">
                  Digite um e-mail válido.
                </p>
              )}

            </div>
            {/* Celular */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="phone">Celular</label>
              <input
                type="tel"
                id="phone"
                value={celular}
                onChange={handleCelular}
                autoComplete="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            {/* CEP */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                value={cep}
                onChange={handleCep}
                onBlur={buscarCep}
                autoComplete="postal-code"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
                maxLength={9}
              />
            </div>
            {/* Endereço */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="street">Endereço</label>
              <input
                type="text"
                id="street"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                ref={enderecoRef}
                autoComplete="street-address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            {/* Número */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                value={numero}
                onChange={e => setNumero(e.target.value)}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/esqueceuSenha")}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow"
            >
              Redefinir Senha por email
            </button>

            {/* BOTÕES */}
            <div className="flex sm:flex-row justify-center gap-3">
              <button
                type="submit"
                disabled={salvando}
                className="w-full sm:w-auto px-8 py-3 rounded-lg 
                bg-gradient-to-r from-purple-600 to-purple-500
                  hover:brightness-105 text-white font-bold transition shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>


            </div>
          </form>
        </section>
      </main>

      {/* Popup de confirmação */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-lg min-w-[320px] max-w-sm flex flex-col items-center relative animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{popup.mensagem}</span>
            <div className="flex gap-5 mt-2">
              {popup.soOk ? (
                <button
                  className="px-7 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 transition"
                  onClick={() => {
                    setPopup(null);
                    popup.acaoSim?.();
                  }}>
                  Ok
                </button>
              ) : (
                <>
                  <button
                    className="px-7 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold shadow hover:brightness-105 transition"
                    onClick={() => {
                      setPopup(null);
                      popup.acaoSim?.();
                    }}>
                    Sim
                  </button>
                  <button
                    className="px-7 py-2 bg-gray-50 border border-gray-300 text-gray-600 rounded-lg font-bold shadow hover:bg-gray-100 transition"
                    onClick={() => setPopup(null)}>
                    Não
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}