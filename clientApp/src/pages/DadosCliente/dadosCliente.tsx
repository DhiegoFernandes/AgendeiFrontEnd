import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLocationOn, MdPhone, MdPerson } from "react-icons/md";
import Logo from "../../assets/LogoAgendei.png";
import ClientNavbar from "../../components/ClientNavbar";
import api from "../../services/api";

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

export default function PerfilCliente() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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

        setUser(response.data);
        console.log("Dados do usuário carregados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarDadosUsuario();
  }, []);

  const formatarTelefone = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  };

  const formatarEndereco = () => {
    if (!user) return "";
    const enderecoCompleto = [user.endereco, user.numero].filter(Boolean).join(", ");
    return enderecoCompleto || "Endereço não informado";
  };

  const formatarCep = (cep: string) => {
    const numeros = cep.replace(/\D/g, "");
    if (numeros.length === 8) {
      return numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cep;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center">
        <div className="text-purple-600 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center">
        <div className="text-red-600 text-xl">Erro ao carregar dados do usuário</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header fixo */}
      <ClientNavbar />

      {/* Card centralizado */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-2">
        <section className="w-full max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center gap-1">
          {/* Avatar: pode trocar lógica/avatar para foto ou inicial */}
          <div className="w-24 h-24 rounded-full bg-purple-50 mb-5 flex items-center justify-center overflow-hidden shadow">
            {/* Imagem logo ou inicial do usuário */}
            <img src={Logo} alt="Avatar Cliente" className="w-20 h-20 object-contain" />
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* Nome */}
            <div className="flex items-center gap-3">
              <MdPerson className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Nome completo</div>
                <div className="font-bold text-[18px] text-gray-900">{user.nome}</div>
              </div>
            </div>
            {/* Email */}
            <div className="flex items-center gap-3">
              <MdEmail className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Email</div>
                <div className="font-bold text-[16px] text-gray-800">{user.email}</div>
              </div>
            </div>
            {/* Celular */}
            <div className="flex items-center gap-3">
              <MdPhone className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Celular</div>
                <div className="font-bold text-[16px] text-gray-800">{formatarTelefone(user.telefone)}</div>
              </div>
            </div>
            {/* CEP */}
            <div className="flex items-center gap-3">
              <MdLocationOn className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Cep</div>
                <div className="font-bold text-[16px] text-gray-800">{formatarCep(user.cep)}</div>
              </div>
            </div>
            {/* Endereço */}
            <div className="flex items-center gap-3">
              <MdLocationOn className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Endereço completo</div>
                <div className="font-bold text-[16px] text-gray-800">{formatarEndereco()}</div>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-7 bg-gradient-to-r from-purple-600 to-purple-500 hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition"
            onClick={() => navigate("/cliente/alterar-dados")}
          >
            Alterar dados
          </button>
        </section>
      </main>
    </div>
  );
}