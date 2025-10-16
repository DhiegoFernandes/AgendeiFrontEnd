import { useState, useRef } from "react";
import { FiArrowLeft, FiUser, FiPhone, FiMail, FiMapPin, FiHome, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Mock inicial
const prestadorMock = {
  nome: "Ricardo Almeida",
  email: "ricardo@barbeariaestilo.com",
  celular: "(11) 99999-8888",
  cep: "01234-567",
  rua: "Rua dos Barbeiros",
  senha: ""
};

export default function AlterarDadosPrestador() {
  const navigate = useNavigate();
  const [nome, setNome] = useState(prestadorMock.nome);
  const [email, setEmail] = useState(prestadorMock.email);
  const [celular, setCelular] = useState(prestadorMock.celular);
  const [cep, setCep] = useState(prestadorMock.cep);
  const [rua, setRua] = useState(prestadorMock.rua);
  const [senha, setSenha] = useState(prestadorMock.senha);
  const [showSenha, setShowSenha] = useState(false);
  const [popup, setPopup] = useState(false);
  const ruaRef = useRef<HTMLInputElement>(null);

  // Máscara celular
  function handleCelular(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    setCelular(v.slice(0, 15));
  }

  // CEP máscara e ViaCEP
  function handleCep(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  async function handleCepBusca() {
    const c = cep.replace(/\D/g, "");
    if (c.length !== 8) return;
    setRua("Buscando...");
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${c}/json/`);
      const data = await resp.json();
      if (data.erro) {
        setRua("");
        alert("CEP não encontrado!");
      } else {
        setRua(data.logradouro || "");
        setTimeout(() => ruaRef.current?.focus(), 180);
      }
    } catch {
      setRua("");
      alert("Erro ao buscar CEP!");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPopup(true);
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-purple-600 to-purple-400 px-5 py-5 mb-8 shadow-lg rounded-b-[32px] flex items-center justify-between">
        <button
          className="flex items-center text-white font-bold gap-2 hover:text-purple-200 transition cursor-pointer"
          onClick={() => navigate("/parceiro/perfil")}
        >
          <FiArrowLeft size={22} />
          <span className="text-base">Voltar ao perfil</span>
        </button>
        <span className="text-2xl font-extrabold text-white tracking-wide mx-auto">Alterar meus dados</span>
        <span className="w-36 hidden sm:block"></span>
      </nav>

      <form className="bg-white max-w-md w-full rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
        {/* Nome */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiUser className="inline mr-2" />Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold"
            required
          />
        </div>
        {/* E-mail */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiMail className="inline mr-2" />E-mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold"
            required
          />
        </div>
        {/* Celular */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiPhone className="inline mr-2" />Celular</label>
          <input
            type="tel"
            value={celular}
            onChange={handleCelular}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold"
            required
          />
        </div>
        {/* CEP */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiMapPin className="inline mr-2" />CEP</label>
          <input
            type="text"
            value={cep}
            onChange={handleCep}
            onBlur={handleCepBusca}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold"
            required
            maxLength={9}
          />
        </div>
        {/* Rua (apenas preenchida pelo cep) */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiHome className="inline mr-2" />Endereço completo</label>
          <input
            type="text"
            value={rua}
            onChange={e => setRua(e.target.value)}
            ref={ruaRef}
            className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold"
            required
            readOnly
          />
        </div>
        {/* Senha */}
        <div>
          <label className="block text-xs text-gray-500 font-bold uppercase mb-1"><FiLock className="inline mr-2" />Senha</label>
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none text-base font-bold pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 cursor-pointer"
              onClick={() => setShowSenha(v => !v)}
              aria-label={showSenha ? "Esconder senha" : "Mostrar senha"}
            >
              {showSenha ? <FiEyeOff size={21} /> : <FiEye size={21} />}
            </button>
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-2"
          type="submit"
        >
          Salvar alterações
        </button>
      </form>

      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-8 py-10 rounded-2xl shadow-xl flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">Dados alterados com sucesso!</span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => {
                setPopup(false);
                navigate("/parceiro/perfil");
              }}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}