// src/components/Header.tsx
import { useNavigate } from "react-router-dom";
import { RiUserReceivedLine } from "react-icons/ri";
import LogoAgendei from "../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário

interface HeaderProps {
  // Propriedades opcionais para personalizar o header
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
  
  return (
    <header className="w-full bg-white shadow">
      <div className="w-full px-5 py-4 flex items-center justify-between mx-auto">
        <img 
          src={LogoAgendei} 
          alt="Agendei" 
          className="w-20 sm:w-20 select-none" 
          onClick={() => navigate("/")}
        />
        
        {showProfileIcon && (
          <span className="text-purple-600 bg-purple-100 rounded-full p-2 hover:bg-purple-200 transition-colors">
            <button className="cursor-pointer" onClick={handleProfileClick}>
              {customIcon || <RiUserReceivedLine size={24} />}
            </button>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;