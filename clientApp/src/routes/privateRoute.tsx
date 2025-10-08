import { Navigate } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import { validateToken } from "../services/authService";

export function PrivateRoute({ children }: { children: ReactNode }) {
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

  if (loading) return <div>Carregando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
