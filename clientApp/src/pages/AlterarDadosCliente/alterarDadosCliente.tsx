import { useRef, useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../../components/ClientNavbar";

// Mock do usuário atual - substitua por dados da API/contexo real.
const dadosCliente = {
  nome: "Maria Costa",
  email: "maria@email.com",
  celular: "(11) 98564-1254",
  cep: "01234-567",
  endereco: "Rua Alegre das Flores Nº 10"
};

function getInitials(nome: string) {
  const arr = nome.split(" ");
  return arr.length > 1 ? arr[0][0] + arr[arr.length-1][0] : arr[0][0];
}

type PopupType = { mensagem: string; acaoSim?: () => void; soOk?: boolean };

export default function AlterarDadosCliente() {
  const navigate = useNavigate();
  // States dos campos
  const [nome, setNome] = useState(dadosCliente.nome);
  const [email, setEmail] = useState(dadosCliente.email);
  const [celular, setCelular] = useState(dadosCliente.celular);
  const [cep, setCep] = useState(dadosCliente.cep);
  const [endereco, setEndereco] = useState(dadosCliente.endereco);
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaVisivel, setConfirmaVisivel] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [popup, setPopup] = useState<null | PopupType>(null);

  const enderecoRef = useRef<HTMLInputElement>(null);

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
    setCep(v.slice(0,9));
  }

  // Busca ViaCEP
  async function buscarCep() {
    const apenasNum = cep.replace(/\D/g,"");
    if (apenasNum.length !== 8) return;
    setEndereco("Buscando...");
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${apenasNum}/json/`);
      const data = await resp.json();
      if (data.erro) {
        setEndereco("");
        alert("CEP não encontrado.");
      } else {
        setEndereco(data.logradouro || "");
        setTimeout(() => enderecoRef.current?.focus(), 100);
      }
    } catch {
      setEndereco("");
      alert("Erro ao buscar CEP.");
    }
  }

  // Avaliação de senha igual
  function checkSenha(s: string, c: string) {
    if (s && c && s !== c) {
      setErroSenha("As senhas não conferem");
      return false;
    }
    setErroSenha("");
    return true;
  }

  // Botão submit
  function onSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!checkSenha(senha, confirmaSenha)) return;
    setPopup({
      mensagem: "Deseja salvar as alterações?",
      acaoSim: () => {
        // Aqui faz a chamada para a API
        setPopup({
          mensagem: "Alterações salvas com sucesso!",
          acaoSim: () => navigate("/perfilCliente"),
          soOk: true // Aqui mostra só o botão Ok!
        });
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

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header */}
        <
          ClientNavbar
        />

      {/* Card */}
      <main className="flex-1 w-full flex flex-col items-center mt-5">
        <section className="bg-white max-w-md w-full rounded-2xl shadow-xl px-7 py-8 flex flex-col items-center gap-2 mb-8">

          <form className="w-full flex flex-col gap-4" autoComplete="off" onSubmit={onSalvar}>
            {/* Nome */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="full-name">Nome completo</label>
              <input
                type="text"
                id="full-name"
                value={nome}
                onChange={e => setNome(e.target.value)}
                autoComplete="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
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
            {/* Senha */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="password">Senha</label>
              <div className="relative">
                <input
                  type={senhaVisivel ? "text" : "password"}
                  id="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
                  autoComplete="new-password"
                  onBlur={() => checkSenha(senha, confirmaSenha)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                  tabIndex={-1}
                  onClick={() => setSenhaVisivel(v => !v)}
                  aria-label="Mostrar/ocultar senha"
                >
                  {senhaVisivel ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                </button>
              </div>
            </div>
            {/* Confirmar senha */}
            <div>
              <label className="block font-bold text-gray-700 mb-1" htmlFor="confirm-password">Confirma a senha</label>
              <div className="relative">
                <input
                  type={confirmaVisivel ? "text" : "password"}
                  id="confirm-password"
                  value={confirmaSenha}
                  onChange={e => {
                    setConfirmaSenha(e.target.value);
                    checkSenha(senha, e.target.value);
                  }}
                  className={`w-full border ${erroSenha ? "border-red-400" : "border-gray-300"} rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10`}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                  tabIndex={-1}
                  onClick={() => setConfirmaVisivel(v => !v)}
                  aria-label="Mostrar/ocultar senha"
                >
                  {confirmaVisivel ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                </button>
              </div>
              <span className="text-red-500 text-sm mt-1 block min-h-[20px]">{erroSenha}</span>
            </div>

            {/* BOTÕES */}
            <div className="flex sm:flex-row justify-center gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-lg 
                bg-gradient-to-r from-purple-600 to-purple-500
                  hover:brightness-105 text-white font-bold transition shadow cursor-pointer"
              >
                Salvar alterações
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