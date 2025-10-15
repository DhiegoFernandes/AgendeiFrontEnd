import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiArrowLeft } from "react-icons/fi";

const dadosPrestador = {
  nome: "Ricardo Almeida",
  email: "ricardo@barbeariaestilo.com",
  celular: "(11) 99999-8888",
  cep: "01234-567",
  rua: "Rua dos Barbeiros, 123"
};

export default function VisualizarDadosPrestador() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-purple-600 to-purple-400 px-5 py-5 mb-8 shadow-lg rounded-b-[32px] flex items-center justify-between">
        <button
          className="flex items-center text-white font-bold gap-2 hover:text-purple-200 transition cursor-pointer"
          onClick={() => navigate("/perfilParceiro")}
        >
          <FiArrowLeft size={22} />
          <span className="text-base">Voltar ao perfil</span>
        </button>
        <span className="text-2xl font-extrabold text-white tracking-wide mx-auto">Meus Dados</span>
        <span className="w-36 hidden sm:block"></span>
      </nav>
      
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-2">
        <div className="w-full flex flex-col gap-5 mb-8">
          <div className="flex items-center gap-3 w-full">
            <FiUser className="text-purple-500 text-xl" />
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wide uppercase">Nome</div>
              <div className="text-lg font-bold text-gray-900">{dadosPrestador.nome}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <FiMail className="text-purple-500 text-xl" />
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wide uppercase">E-mail</div>
              <div className="text-base font-bold text-gray-800">{dadosPrestador.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <FiPhone className="text-purple-500 text-xl" />
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wide uppercase">Celular</div>
              <div className="text-base font-bold text-gray-800">{dadosPrestador.celular}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <FiMapPin className="text-purple-500 text-xl" />
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wide uppercase">CEP</div>
              <div className="text-base font-bold text-gray-800">{dadosPrestador.cep}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <FiHome className="text-purple-500 text-xl" />
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wide uppercase">Nome da Rua</div>
              <div className="text-base font-bold text-gray-800">{dadosPrestador.rua}</div>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer"
          onClick={() => navigate("/alterarDadosParceiro")}
        >
          Alterar Dados
        </button>
      </div>
    </div>
  );
}