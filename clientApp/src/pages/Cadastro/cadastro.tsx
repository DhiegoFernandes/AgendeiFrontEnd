import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import type { User } from "../../types/user";
import api from "../../services/api";

export default function Cadastro() {
  const [tipo, setTipo] = useState("CLIENTE");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");
  const [termos, setTermos] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const inputEndereco = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleCep(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");

    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  async function buscarCep() {
    const apenasNum = cep.replace(/\D/g, "");

    if (apenasNum.length !== 8) {
      setEndereco("");
      return;
    }

    setEndereco("Buscando...");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${apenasNum}/json/`);

      const data = await res.json();

      if (data.erro) {
        setEndereco("");
      } else {
        setEndereco(data.logradouro || "");
        setTimeout(() => inputEndereco.current?.focus(), 200);
      }
    } catch {
      setEndereco("");
    }
  }

   const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const dataToSend:User = {
                nome,
                email,  
                telefone: celular,
                senha,
                perfil: tipo,
                cep,
                endereco,
                numero
            }

            const response = await api.post("/usuarios/registrar", dataToSend)
            console.log(response)
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full max-w-2xl bg-white rounded-xl p-5 flex justify-between items-center mb-8 shadow">
        <img src={LogoAgendeiHori} alt="Agendei" className="w-52 mr-5" />
        <nav>
          <a
            href="#"
            onClick={e => { e.preventDefault(); navigate("/login"); }}
            className="text-gray-700 text-base"
          >
            Já tem conta? <span className="font-bold text-purple-700 hover:underline">Fazer login</span>
          </a>
        </nav>
      </header>

      {/* FORM CARD */}
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-1">Criar Conta</h1>
        <p className="text-center text-gray-700 mb-6">Preencha seus dados para começar a agendar</p>
        <form autoComplete="off" onSubmit={handleRegister}>
          {/* Tipo de conta */}
          <div className="mb-4">
            <label className="block font-bold mb-1">
              Tipo de conta <span className="text-red-500">*</span>
            </label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 outline-purple-400"
              required
            >
              <option value="CLIENTE">Cliente</option>
              <option value="PRESTADOR">Prestador</option>
            </select>
          </div>
          {/* Nome */}
          <div className="mb-4">
            <label className="block font-bold mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              value={nome}
              required
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full border border-gray-300 rounded p-2 outline-purple-400"
              type="text"
              autoComplete="off"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block font-bold mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded p-2 outline-purple-400"
              type="email"
              autoComplete="off"
            />
          </div>
          {/* Celular */}
          <div className="mb-4">
            <label className="block font-bold mb-1">
              Celular <span className="text-red-500">*</span>
            </label>
            <input
              value={celular}
              required
              onChange={e => setCelular(e.target.value)}
              placeholder="11999999999"
              className="w-full border border-gray-300 rounded p-2 outline-purple-400"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              autoComplete="off"
            />
          </div>
          {/* CEP/Endereço somente para cliente */}
          {tipo === "CLIENTE" && (
            <>
              <div className="mb-4">
                <label className="block font-bold mb-1">
                  CEP <span className="text-red-500">*</span>
                </label>
                <input
                  value={cep}
                  required
                  onChange={handleCep}
                  onBlur={() => { if (cep.replace(/\D/g, "").length === 8) buscarCep(); }}
                  placeholder="00000-000"
                  className="w-full border border-gray-300 rounded p-2 outline-purple-400"
                  type="text"
                  maxLength={9}
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-1">
                  Endereço completo <span className="text-red-500">*</span>
                </label>
                <input
                  value={endereco}
                  required
                  onChange={e => setEndereco(e.target.value)}
                  placeholder="Ex: Rua 25 de março"
                  className="w-full border border-gray-300 rounded p-2 outline-purple-400"
                  type="text"
                  ref={inputEndereco}
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-1">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  value={numero}
                  required
                  onChange={e => setNumero(e.target.value)}
                  placeholder="Ex: 352"
                  className="w-full border border-gray-300 rounded p-2 outline-purple-400"
                  type="text"
                  autoComplete="off"
                />
              </div>
            </>
          )}
          {/* Senha */}
          <div className="mb-4">
            <label className="block font-bold mb-1">
              Senha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                value={senha}
                required
                onChange={e => setSenha(e.target.value)}
                placeholder=""
                className="w-full border border-gray-300 rounded p-2 pr-10 outline-purple-400"
                type={showSenha ? "text" : "password"}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-700 cursor-pointer"
                tabIndex={-1}
                onClick={() => setShowSenha(s => !s)}
              >
                {showSenha ? (
                  <svg width="22" height="22" fill="none" viewBox="0 0 20 20">
                    <path d="M2 2l16 16" stroke="#7c4eff" strokeWidth={2}/>
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                    <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                  </svg>
                ) : (
                  <svg width="22" height="22" fill="none" viewBox="0 0 20 20">
                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                    <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">
              Confirma a senha <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              required
              checked={termos}
              onChange={e => setTermos(e.target.checked)}
              className="accent-purple-600"
            />
            <label htmlFor="terms" className="text-gray-900 text-sm select-none">
              Eu concordo com os{" "}
              <a href="#" className="text-blue-700 font-bold underline">Termos de Uso</a> e{" "}
              <a href="#" className="text-blue-700 font-bold underline">Política de Privacidade</a>
            </label>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-48 h-11 rounded font-bold bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </main>
 </div>
);
}