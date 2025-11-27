import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine, RiUserReceivedLine } from "react-icons/ri";
import LogoAgendei from "../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário

interface HeaderProps {
  profilePath?: string;        // Caminho para a página de perfil
  showProfileIcon?: boolean;   // Se deve mostrar o ícone de perfil
  customIcon?: React.ReactNode; // Ícone personalizado opcional
  onProfileClick?: () => void; // Função personalizada ao clicar no perfil
}

const Header: React.FC<HeaderProps> = ({
  profilePath = "/parceiro/perfil",
  showProfileIcon = true,
  customIcon,
  onProfileClick
}) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else if (profilePath) {
      navigate(profilePath);
    }
  };

  const handleBack = () => {
    navigate(-1); // volta para a página anterior
  };

  return (
    <header className="w-full bg-white shadow">
      <div className="w-full px-5 py-4 flex items-center justify-between mx-auto">
        {/* Logo */}
        <img
          src={LogoAgendei}
          alt="Agendei"
          className="w-12 h-12 sm:w-16 sm:h-16 select-none cursor-pointer"
          onClick={() => {
            const perfil = localStorage.getItem("perfil");
            if (perfil === "admin") {
              navigate("/admin/painelAdm");
            } else if (perfil === "cliente") {
              navigate("/cliente/comercios");
            } else {
              navigate("/prestador/escolha");
            }
          }}
        />

        <span className="ml-2 text-2xl font-extrabold select-none cursor-pointer flex items-center" onClick={() => {
          const perfil = localStorage.getItem("perfil");
          if (perfil === "admin") {
            navigate("/admin/painelAdm");
          } else if (perfil === "cliente") {
            navigate("/cliente/comercios");
          } else {
            navigate("/prestador/escolha");
          }
        }}>
          <span className="text-purple-600">Agend</span>
          <span className="text-orange-500">ei</span>
        </span>



        <div className="flex items-center gap-4">
          {/* Botão Voltar */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-all cursor-pointer 
             transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <RiArrowLeftSLine size={20} />
            Voltar
          </button>

          {/* Ícone de perfil */}
          {/* {showProfileIcon && (
            <button
              onClick={handleProfileClick}
              className="text-purple-600 bg-purple-100 rounded-full p-2 hover:bg-purple-200 transition-colors"
            >
              {customIcon || <RiUserReceivedLine size={24} />}
            </button>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
