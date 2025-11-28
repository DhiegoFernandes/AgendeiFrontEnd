// components/ClientNavbar.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoAgendei from "../assets/LogoAgendei.png"; // Ajuste o caminho conforme necessário
import LogoutButton from "./LogoutButton";

// Importações dos ícones
import { 
  FiHome, 
  FiCalendar, 
  FiUser, 
  FiMenu, 
  FiX
} from "react-icons/fi";

const ClientNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/cliente/comercios", icon: <FiHome size={20} /> },
    { name: "Agendamentos", path: "/cliente/agendamento", icon: <FiCalendar size={20} /> }
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4">
        {/* Desktop Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/cliente/comercios")}
          >
            <img src={LogoAgendei} alt="Agendei" className="h-15" />
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 font-medium text-sm transition-colors cursor-pointer ${
                  isActive(link.path)
                    ? "text-purple-700" 
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Menu */}
            <button 
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
              onClick={() => navigate("/cliente/perfil")}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer">
                <FiUser size={18} className="text-purple-700" />
              </div>
              <span className="font-medium text-sm">Meu Perfil</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              className="p-2 rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 pt-2 pb-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg ${
                  isActive(link.path)
                    ? "bg-purple-50 text-purple-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
            
            <div className="w-full border-t my-2 border-gray-100"></div>
            
            <button
              onClick={() => {
                navigate("/cliente/perfil");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FiUser size={20} />
              <span>Meu Perfil</span>
            </button>
            
            <div className="w-full border-t my-2 border-gray-100"></div>
            
            <div className="px-4">
              <LogoutButton variant="default" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;