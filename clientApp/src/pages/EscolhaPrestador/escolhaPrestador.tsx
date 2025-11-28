import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaHandshake, FaStore, FaSpinner } from "react-icons/fa";

export default function EscolhaPrestador() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarNegocio() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Buscar dados do usuário
        const userResponse = await api.get("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const userData = userResponse.data;
        const negocio = userData.negocio;

        if (negocio && negocio.id) {
          // Se tem negócio ativo, vai direto para o perfil
          if (negocio.ativo) {
            navigate("/parceiro/perfil");
            return;
          } else {
            // Se tem negócio mas está desativado, redireciona para escolher plano
            navigate("/prestador/criar-negocio?escolherPlano=true");
            return;
          }
        }

        // Se chegou aqui, não tem negócio - mostra a página de escolha
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao verificar dados do usuário:", error);
        setCarregando(false);
      }
    }

    verificarNegocio();
  }, [navigate]);

  function handleEsperarConvite() {
    navigate("/");
  }

  function handleCriarNegocio() {
    navigate("/prestador/criar-negocio");
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-purple-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  const nomeUsuario = localStorage.getItem("nome") || "Prestador";

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Olá, {nomeUsuario}!
          </h1>
          <p className="text-lg text-gray-600">
            Escolha como deseja começar no Agendei
          </p>
        </div>

        {/* Cards de Opções */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Opção 1: Esperar Convite */}
          <div 
            onClick={handleEsperarConvite}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-purple-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Esperar Convite
              </h2>
              <p className="text-gray-600 mb-4">
                Aguarde um convite de outro prestador para fazer parte de um negócio existente.
              </p>
              <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sem custos iniciais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Comece a trabalhar imediatamente</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Gerencie seus próprios serviços</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition cursor-pointer">
                Esperar Convite
              </button>
            </div>
          </div>

          {/* Opção 2: Criar Negócio */}
          <div 
            onClick={handleCriarNegocio}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 border-2 border-purple-500 relative"
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Mais Popular
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaStore className="text-orange-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Criar Meu Negócio
              </h2>
              <p className="text-gray-600 mb-4">
                Crie seu próprio negócio e convide outros prestadores para sua equipe.
              </p>
              <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Controle total do negócio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Convide outros prestadores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Planos a partir de R$ 49,90/mês</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:brightness-110 transition shadow-lg cursor-pointer">
                Criar Negócio
              </button>
            </div>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 text-sm">
            💡 <strong>Dica:</strong> Você pode mudar de opção a qualquer momento nas configurações do seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}

