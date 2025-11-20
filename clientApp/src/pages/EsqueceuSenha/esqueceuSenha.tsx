import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoAgendei from "../../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineLockClosed } from "react-icons/hi";

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Validar formato de email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Função para enviar solicitação de recuperação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Limpar estados
    setError(null);
    
    // Validar email
    if (!email.trim()) {
      setError("Por favor, informe seu e-mail");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Por favor, informe um e-mail válido");
      return;
    }
    
    // Simulando envio
    setIsLoading(true);
    
    try {
      // Aqui você faria a chamada real para sua API
      // await api.post("/auth/recuperar-senha", { email });
      
      // Simulando uma chamada
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
    } catch (err) {
      setError("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
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
              Esqueceu sua senha?
            </h1>
            <p className="text-gray-500 mt-2 text-center">
              Enviaremos um link para recuperar sua senha
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-400 text-xl" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                  required
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl shadow-md hover:brightness-105 transition cursor-pointer ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center">
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              <HiOutlineArrowLeft className="mr-1" />
              <span>Voltar para login</span>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="flex items-center text-sm font-semibold text-purple-800">
                <HiOutlineLockClosed className="mr-2 text-lg" />
                Dica de segurança
              </h3>
              <p className="text-xs text-purple-700 mt-1">
                Após redefinir sua senha, lembre-se de criar uma senha forte combinando letras maiúsculas, minúsculas, números e símbolos.
              </p>
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
              E-mail enviado!
            </h1>
            
            <p className="text-gray-500 mt-2 text-center">
              Enviamos as instruções de recuperação para:
            </p>
            <p className="font-medium text-purple-700 mt-1 mb-6">{email}</p>
            
            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Verifique sua caixa de entrada e pasta de spam. O link de recuperação expira em 10 minutos.
            </p>
            
            <button 
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl shadow-md hover:brightness-105 transition cursor-pointer"
            >
              Voltar para login
            </button>
            
            <button 
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="mt-4 text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              Não recebeu o e-mail? Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}