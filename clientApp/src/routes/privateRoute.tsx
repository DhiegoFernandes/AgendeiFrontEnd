import { useNavigate } from "react-router-dom";

import { useState, useEffect, type ReactNode } from "react";
import { validateToken } from "../services/authService";

interface PrivateRouteProps {
  children: ReactNode;
  requiredProfile?: "cliente" | "prestador" | "admin";
}

export function PrivateRoute({ children, requiredProfile }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function check() {
      setLoading(true);
      const result = await validateToken();
      setIsAuthenticated(result.isAuthenticated);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f5fb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se há um perfil requerido, verificar se o usuário tem esse perfil
  if (requiredProfile) {
    const userProfile = localStorage.getItem("perfil")?.toLowerCase();
    const requiredProfileLower = requiredProfile.toLowerCase();

    if (userProfile !== requiredProfileLower) {
      // Redirecionar baseado no perfil do usuário
      if (userProfile === "admin") {
        return <Navigate to="/admin/painelAdm" replace />;
      } else if (userProfile === "cliente") {
        return <Navigate to="/cliente/comercios" replace />;
      } else if (userProfile === "prestador") {
        return <Navigate to="/prestador/escolha" replace />;
      }
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
