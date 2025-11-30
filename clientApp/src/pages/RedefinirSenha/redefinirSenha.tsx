import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LogoAgendei from "../../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FiCheck, FiX } from "react-icons/fi";
import api from "../../services/api";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extrair email e código da URL ao carregar a página
  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const codigoParam = searchParams.get("codigo") || "";

    setEmail(emailParam);
    setCodigo(codigoParam);

    // Verificar se os parâmetros foram fornecidos
    if (!emailParam || !codigoParam) {
      setError("Link inválido. Por favor, use o link enviado no seu e-mail.");
    }
  }, [searchParams]);

  // Validação de requisitos de senha
  const validarSenha = (senha: string) => {
    return {
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
    };
  };

  const requisitos = validarSenha(senha);
  const senhaValida = Object.values(requisitos).every(v => v);

  // Função para redefinir senha
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Limpar estados
    setError(null);
    // Validações
    if (!email || !codigo) {
      setError("Link inválido ou expirado. Solicite uma nova recuperação de senha.");
      return;
    }
    if (!senha.trim()) {
      setError("Por favor, informe sua nova senha");
      return;
    }
    if (!senhaValida) {
      setError("A senha não atende aos requisitos de segurança");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      // Chamada real para API
      const response = await api.post("/auth/nova-senha", {
        email,
        codigo,
        novaSenha: senha
      });

      // Checar se a resposta da API foi sucesso
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 5000);
      } else {
        setError("Não foi possível redefinir a senha. Tente novamente.");
      }
    } catch (err: any) {
      // Tratar erro vindo da API
      if (err.response?.data?.mensagem) {
        setError(err.response.data.mensagem);
      } else {
        setError("Erro ao redefinir a senha. O código pode estar expirado ou inválido.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center justify-center p-4">
      {!success ? (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={LogoAgendei} alt="Agendei" className="w-16 h-16 mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
              Redefinir Senha
            </h1>
            <p className="text-gray-500 mt-2 text-center">
              Crie uma nova senha segura para sua conta
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nova Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Nova senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-400 text-xl" />
                </div>
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="w-full pl-10 pr-12 py-3 border-2 border-purple-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {mostrarSenha ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Requisitos de senha */}
            {senha && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Requisitos da senha:
                </h3>
                <ul className="space-y-1">
                  <li className={`text-xs flex items-center ${requisitos.tamanho ? 'text-green-600' : 'text-gray-500'}`}>
                    {requisitos.tamanho ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                    Mínimo de 8 caracteres
                  </li>
                  <li className={`text-xs flex items-center ${requisitos.maiuscula ? 'text-green-600' : 'text-gray-500'}`}>
                    {requisitos.maiuscula ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                    Pelo menos uma letra maiúscula
                  </li>
                  <li className={`text-xs flex items-center ${requisitos.minuscula ? 'text-green-600' : 'text-gray-500'}`}>
                    {requisitos.minuscula ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                    Pelo menos uma letra minúscula
                  </li>
                  <li className={`text-xs flex items-center ${requisitos.numero ? 'text-green-600' : 'text-gray-500'}`}>
                    {requisitos.numero ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                    Pelo menos um número
                  </li>
                  <li className={`text-xs flex items-center ${requisitos.especial ? 'text-green-600' : 'text-gray-500'}`}>
                    {requisitos.especial ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                    Pelo menos um caractere especial
                  </li>
                </ul>
              </div>
            )}

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-400 text-xl " />
                </div>
                <input
                  id="confirmarSenha"
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="w-full pl-10 pr-12 py-3 border-2 border-purple-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {mostrarConfirmarSenha ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
              {confirmarSenha && senha !== confirmarSenha && (
                <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
              )}
              {confirmarSenha && senha === confirmarSenha && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <FiCheck className="mr-1" /> As senhas coincidem
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !senhaValida || senha !== confirmarSenha}
              className={`w-full py-3 px-4 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl shadow-md hover:brightness-105 transition ${(isLoading || !senhaValida || senha !== confirmarSenha) ? 'opacity-60 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? "Redefinindo senha..." : "Redefinir senha"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-800 transition-colors text-sm cursor-pointer"
            >
              Voltar para login
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="flex items-center text-sm font-semibold text-purple-800">
                <HiOutlineLockClosed className="mr-2 text-lg" />
                Dica de segurança
              </h3>
              <ul className="text-xs text-purple-700 mt-2 space-y-1 list-disc pl-5">
                <li>Nunca compartilhe sua senha com ninguém</li>
                <li>Use uma senha única para cada serviço</li>
                <li>Considere usar um gerenciador de senhas</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
              Senha redefinida!
            </h1>

            <p className="text-gray-500 mt-4 text-center">
              Sua senha foi redefinida com sucesso.
            </p>

            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Você será redirecionado para o login em alguns segundos...
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl shadow-md hover:brightness-105 transition"
            >
              Ir para login agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}