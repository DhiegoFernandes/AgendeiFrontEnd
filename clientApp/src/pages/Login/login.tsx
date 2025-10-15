import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

      const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const dataToLogin ={
                email,
                senha
            }

            const response = await api.post("/auth/login", dataToLogin)

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("perfil", response.data.perfil)
            localStorage.setItem("nome", response.data.nome)

            navigate(`/${response.data.perfil}`)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-md w-full max-w-md px-8 py-8 relative flex flex-col items-center">
        {/* Voltar */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-6 top-6 text-purple-600 font-medium flex items-center gap-1 text-sm cursor-pointer"
        >
          <span className="inline-block text-lg cursor-pointer">&#8592;</span> Voltar para Home
        </button>
        {/* Logo */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <img src={LogoAgendeiHori} alt="Agendei" className="w-40" />
        </div>
        {/* Texto subtitulo */}
        <p className="text-center text-gray-600 mb-1">Seu agendamento simplificado</p>
        {/* Bem-vindo */}
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Bem-vindo</h2>
        {/* Formulário */}
        <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
          {/* Email */}
          <div className="w-full mb-4">
            <label className="block font-semibold mb-1 text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              placeholder="Digite o email"
              className="w-full p-2 rounded border border-gray-300 bg-gray-100 outline-purple-400"
              required
            />
          </div>
          {/* Senha */}
          <div className="w-full mb-2 relative">
            <label className="block font-semibold mb-1 text-gray-700">Senha</label>
            <input
              type={showSenha ? "text" : "password"}
              value={senha}
              autoComplete="current-password"
              onChange={e => setSenha(e.target.value)}
              placeholder="Digite a senha"
              className="w-full p-2 rounded border border-gray-300 bg-gray-100 outline-purple-400 pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-9 text-purple-700 cursor-pointer"
              onClick={() => setShowSenha((p) => !p)}
              aria-label="Mostrar/Ocultar senha"
            >
              {/* Ícone olho (SVG) */}
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
          {/* Link esqueceu senha */}
          <div className="w-full mb-6 text-right">
            <a href="#" className="text-purple-700 text-sm font-medium hover:underline">
              Esqueceu a senha?
            </a>
          </div>
          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition cursor-pointer"
          >
            Entrar
          </button>
        </form>
        {/* Cadastro */}
        <div className="w-full mt-6 text-center text-gray-700 text-base">
          Não tem uma conta?{" "}
          <button
            type="button"
            className="text-purple-700 font-bold hover:underline cursor-pointer"
            onClick={() => {navigate("/cadastro")}}
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
);
}
