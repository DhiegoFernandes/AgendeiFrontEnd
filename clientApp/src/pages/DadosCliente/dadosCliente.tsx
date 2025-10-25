import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { MdEmail, MdLocationOn, MdPhone, MdPerson } from "react-icons/md";
import Logo from "../../assets/LogoAgendei.png"; // Ajuste o path da sua logo
import ClientNavbar from "../../components/ClientNavbar";

// Sugestão: dados do usuário vindos da API ou contexto
const user = {
  nome: "Maria Costa",
  email: "maria@email.com",
  celular: "(11) 98765-4321",
  cep: "01234-567",
  endereco: "Rua Alegre das Flores Nº 10",
};

export default function PerfilCliente() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header fixo */}
        <
          ClientNavbar
        />

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
                <div className="font-bold text-[16px] text-gray-800">{user.celular}</div>
              </div>
            </div>
            {/* CEP */}
            <div className="flex items-center gap-3">
              <MdLocationOn className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Cep</div>
                <div className="font-bold text-[16px] text-gray-800">{user.cep}</div>
              </div>
            </div>
            {/* Endereço */}
            <div className="flex items-center gap-3">
              <MdLocationOn className="text-purple-500 text-xl" />
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">Endereço completo</div>
                <div className="font-bold text-[16px] text-gray-800">{user.endereco}</div>
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