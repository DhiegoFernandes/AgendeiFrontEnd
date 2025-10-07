import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineLogout, HiOutlineUserCircle, HiOutlineMail, HiOutlineLocationMarker, HiOutlineCog } from "react-icons/hi";
import { AiFillStar, AiOutlineShop } from "react-icons/ai";
import { FiLock, FiHelpCircle } from "react-icons/fi";
import { MdAssignment } from "react-icons/md";

function getInitials(nome: string) {
  const parts = nome.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] ?? "") + (parts[1][0] ?? "")
    : parts[0][0] ?? "";
}

// MOCK dados
const user = {
  nome: "João Paulo",
  email: "joao.paulo@gmail.com",
  cidade: "São Paulo, SP",
  clienteDesde: "2022",
  agendamentos: 12,
  pendentes: 3,
};

export default function PerfilCliente() {
  const navigate = useNavigate();

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
                {user.cidade} • <span>Cliente desde {user.clienteDesde}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
            <button
              className="px-5 py-2 rounded-lg border-2 border-white text-white bg-white/10 hover:bg-white/20 font-semibold shadow"
              onClick={() => navigate("/alterar-dados")}
            >
              Editar Perfil
            </button>
            <button
              className="px-5 py-2 rounded-lg border-2 border-white text-purple-900 bg-white/90 hover:bg-white font-semibold shadow"
              onClick={() => navigate("/agendamentos")}
            >
              Ver Agendamentos
            </button>
            <button
              className="px-5 py-2 rounded-lg border-2 border-white text-purple-900 bg-white/90 hover:bg-white font-semibold shadow"
              onClick={() => navigate("/comercios")}
            >
              Procurar Comercios
            </button>
          </div>
        </div>

        {/* KPIs animadas */}
        <div className="flex flex-col gap-5 mt-10 md:mt-0 md:items-end justify-center">
          <div className="flex gap-5">
            <article
              className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 flex flex-col items-center min-w-[120px] shadow-lg animate-fadeIn">
              <div className="flex items-center gap-1 mb-2 text-white/80">
                <MdAssignment size={20} className="text-white/90" />
                <span className="text-lg font-semibold">Agendamentos</span>
              </div>
              <span className="text-3xl font-extrabold text-white drop-shadow-lg">{user.agendamentos}</span>
            </article>
            <article
              className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 flex flex-col items-center min-w-[120px] shadow-lg animate-fadeIn">
              <div className="flex items-center gap-1 mb-2 text-white/80">
                <AiFillStar size={18} className="text-yellow-300" />
                <span className="text-lg font-semibold">Pendentes</span>
              </div>
              <span className="text-3xl font-extrabold text-yellow-100 drop-shadow-lg">{user.pendentes}</span>
            </article>
          </div>
        </div>
      </header>

      {/* MENU GRID */}
      <main className="max-w-4xl mx-auto mt-10 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
          {/* CARD Conta */}
          <section className="bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
            <h3 className="bg-gray-50 px-8 py-4 font-bold text-lg border-b border-gray-100">
              Conta
            </h3>
            <ul className="divide-y divide-gray-100">
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition" onClick={() => navigate("/visualizar-dados")}>
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
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition" onClick={() => navigate("/alterar-senha")}>
                  <div className="flex items-center gap-4">
                    <FiLock className="text-purple-600 text-xl" />
                    <span className="flex flex-col items-start">
                      <strong className="-mb-1">Alterar Senha</strong>
                      <span className="text-xs text-gray-500">Mantenha sua conta segura</span>
                    </span>
                  </div>
                  <span className="ml-3 text-purple-300 group-hover:text-purple-700 text-xl">›</span>
                </button>
              </li>
            </ul>
          </section>

          {/* CARD Outros */}
          <section className="bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
            <h3 className="bg-gray-50 px-8 py-4 font-bold text-lg border-b border-gray-100">
              Outros
            </h3>
            <ul className="divide-y divide-gray-100">
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition" onClick={() => navigate("/ajuda")}>
                  <div className="flex items-center gap-4">
                    <FiHelpCircle className="text-purple-600 text-xl" />
                    <span className="flex flex-col items-start">
                      <strong className="-mb-1">Ajuda e Suporte</strong>
                      <span className="text-xs text-gray-500">Central de ajuda e contato</span>
                    </span>
                  </div>
                  <span className="ml-3 text-purple-300 group-hover:text-purple-700 text-xl">›</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition" onClick={() => navigate("/politica-privacidade")}>
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
              <li>
                <button className="w-full flex items-center justify-between group px-8 py-4 hover:bg-purple-50 transition" onClick={() => navigate("/sobre")}>
                  <div className="flex items-center gap-4">
                    <HiOutlineCog className="text-purple-600 text-xl" />
                    <span className="flex flex-col items-start">
                      <strong className="-mb-1">Sobre o Agendei</strong>
                      <span className="text-xs text-gray-500">Quem somos e nossa missão</span>
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
            className="flex items-center gap-2 py-3 px-7 rounded-xl border-2 border-red-300 text-red-600 font-bold bg-white hover:bg-red-50 transition text-lg shadow"
            onClick={() => alert('Sessão encerrada!')}
          >
            <HiOutlineLogout />
            Sair
          </button>
        </section>
      </main>
    </div>
  );
}