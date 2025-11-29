import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineLogout, HiOutlineUserCircle, HiOutlineMail } from "react-icons/hi";
import api from "../../services/api";

function getInitials(nome: string) {
  const parts = nome.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] ?? "") + (parts[1][0] ?? "")
    : parts[0][0] ?? "";
}

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


  // Dentro do PerfilCliente
  const [popup, setPopup] = useState<{ msg: string; ok?: () => void } | null>(null);

  function handlePopupOk() { setPopup(null); }
  function handlePopupSim() { popup?.ok?.(); setPopup(null); }

  // Função de logout
  function confirmarLogout() {
    setPopup({
      msg: "Deseja realmente sair?",
      ok: () => {
        localStorage.removeItem("token"); // Remove token
        navigate('/'); // Redireciona
      }
    });
  }

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

  const formatarEndereco = () => {
    const enderecoCompleto = [user.endereco, user.numero].filter(Boolean).join(", ");
    return enderecoCompleto || "Endereço não informado";
  };

  return (
    <div className="min-h-screen bg-[#f6f5fb]">
      {/* Hero Gradient */}
      <header className="bg-gradient-to-br from-purple-600 to-purple-400 py-10 px-4 flex flex-col md:flex-row md:items-start md:justify-between relative shadow-md rounded-b-3xl">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <button
            className="absolute left-4 top-5 text-white/90 bg-purple-700/30 hover:bg-purple-800/40 p-2 rounded-full block md:hidden"
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <HiOutlineArrowLeft size={25} />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow mt-3 md:mt-0 text-center md:text-left">
            Meu Perfil
          </h1>
          <div className="flex items-center gap-5 mt-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-lg text-white font-extrabold text-2xl ring-4 ring-white/10 select-none uppercase">
              {getInitials(user.nome)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white">{user.nome}</span>
              <span className="text-white/80 font-medium">{user.email}</span>
              <span className="text-white/60 text-sm mt-1">
                {formatarEndereco()}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
            <button
              className="px-5 py-2 rounded-lg border-2 cursor-pointer border-white text-white bg-white/10 hover:bg-white/20 font-semibold shadow flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <HiOutlineArrowLeft />
              Voltar
            </button>

            

            <button
              className="px-5 py-2 rounded-lg border-2 border-white cursor-pointer text-white bg-white/10 hover:bg-white/20 font-semibold shadow"
              onClick={() => navigate("/cliente/alterar-dados")}
            >
              Editar Perfil
            </button>
            <button
              className="px-5 py-2 rounded-lg border-2 border-white cursor-pointer text-purple-900 bg-white/90 hover:bg-white font-semibold shadow"
              onClick={() => navigate("/cliente/agendamento")}
            >
              Ver Agendamentos
            </button>
            <button
              className="px-5 py-2 rounded-lg border-2 border-white cursor-pointer text-purple-900 bg-white/90 hover:bg-white font-semibold shadow"
              onClick={() => navigate("/cliente/comercios")}
            >
              Procurar Comercios
            </button>
          </div>
        </div>
      </header>

      {/* MENU GRID */}
      <main className="max-w-4xl mx-auto mt-10 px-2">
        <div className="flex justify-center mb-8">
          {/* CARD Conta */}
          <section className="bg-white rounded-2xl shadow-xl p-0 overflow-hidden max-w-md w-full">
            <h3 className="bg-gray-50 px-8 py-4 font-bold text-lg border-b border-gray-100">
              Conta
            </h3>
            <ul className="divide-y divide-gray-100">
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition cursor-pointer" onClick={() => navigate("/cliente/dados")}>
                  <div className="flex items-center gap-4">
                    <HiOutlineUserCircle className="text-purple-600 text-xl" />
                    <span className="flex flex-col items-start">
                      <strong className="-mb-1">Informações Pessoais</strong>
                      <span className="text-xs text-gray-500">Nome, e‑mail, telefone e endereço</span>
                    </span>
                  </div>
                  <span className="ml-3 text-purple-300 group-hover:text-purple-700 text-xl">›</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition cursor-pointer" onClick={() => navigate("/politicaPrivacidade")}>
                  <div className="flex items-center gap-4">
                    <HiOutlineMail className="text-purple-600 text-xl" />
                    <span className="flex flex-col items-start">
                      <strong className="-mb-1">Política de Privacidade</strong>
                      <span className="text-xs text-gray-500">Saiba como cuidamos dos seus dados</span>
                    </span>
                  </div>
                  <span className="ml-3 text-purple-300 group-hover:text-purple-700 text-xl">›</span>
                </button>
              </li>
            </ul>
          </section>
        </div>

        {/* Botão de sair */}
        <section className="flex justify-center mb-10">
          <button
            className="flex items-center gap-2 py-3 px-7 cursor-pointer rounded-xl border-2 border-red-300 text-red-600 font-bold bg-white hover:bg-red-50 transition text-lg shadow"
            onClick={confirmarLogout}
          >
            <HiOutlineLogout />
            Sair
          </button>
        </section>

      </main>

      {popup && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white px-7 py-10 rounded-2xl shadow-lg w-full max-w-[380px] flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-4 text-center">{popup.msg}</span>
            <div className="flex gap-4">
              {popup.ok ? (
                <>
                  <button
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-700 text-white font-bold hover:brightness-105 shadow cursor-pointer"
                    onClick={handlePopupSim}
                  >
                    Sim
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 shadow cursor-pointer"
                    onClick={handlePopupOk}
                  >
                    Não
                  </button>
                </>
              ) : (
                <button
                  className="px-8 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:brightness-105 shadow cursor-pointer"
                  onClick={handlePopupOk}
                >
                  Ok
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}