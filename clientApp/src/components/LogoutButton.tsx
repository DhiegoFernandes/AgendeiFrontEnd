import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

interface LogoutButtonProps {
  variant?: "default" | "icon" | "text";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export default function LogoutButton({ 
  variant = "default", 
  className = "",
  showIcon = true,
  showText = true
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  const handleLogout = () => {
    // Remover dados do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    localStorage.removeItem("nome");
    
    // Redirecionar para home
    navigate("/");
  };

  const baseClasses = "transition cursor-pointer";
  
  let buttonClasses = "";
  let content = null;

  switch (variant) {
    case "icon":
      buttonClasses = `${baseClasses} p-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 ${className}`;
      content = <FiLogOut size={20} />;
      break;
    case "text":
      buttonClasses = `${baseClasses} text-red-600 hover:text-red-700 font-medium ${className}`;
      content = "Sair";
      break;
    default:
      // Se className customizado contém classes de background, usar apenas ele
      const hasCustomBg = className && (className.includes("bg-") || className.includes("hover:bg-"));
      if (hasCustomBg) {
        buttonClasses = `${baseClasses} flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${className}`;
      } else {
        buttonClasses = `${baseClasses} flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium ${className}`;
      }
      content = (
        <>
          {showIcon && <FiLogOut size={18} />}
          {showText && <span>Sair</span>}
        </>
      );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmacao(true)}
        className={buttonClasses}
        title="Sair"
        aria-label="Sair do sistema"
      >
        {content}
      </button>

      {/* Popup de confirmação */}
      {showConfirmacao && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-8 flex flex-col items-center max-w-md w-full animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              Deseja realmente sair?
            </span>
            <p className="text-gray-600 text-center mb-6">
              Você será desconectado e precisará fazer login novamente para acessar o sistema.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowConfirmacao(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:brightness-110 shadow transition cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

