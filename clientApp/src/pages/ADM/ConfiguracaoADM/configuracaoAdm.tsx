import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../../services/api";

interface AdminData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  ativo: boolean;
}

export default function ConfiguracaoAdm() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function buscarDadosAdmin() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token não encontrado");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<AdminData>("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setAdminData(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar dados do admin:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    buscarDadosAdmin();
  }, []);

  function formatarTelefone(telefone: string) {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Configurações</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      ) : adminData ? (
        <div className="bg-white shadow rounded-xl p-6 flex flex-col gap-5 max-w-md mx-auto">
          <div>
            <label className="font-bold text-gray-700">Nome</label>
            <div className="mt-1 text-lg font-semibold text-purple-600">{adminData.nome}</div>
          </div>
          <div>
            <label className="font-bold text-gray-700">E-mail</label>
            <div className="mt-1 text-lg text-gray-800">{adminData.email}</div>
          </div>
          <div>
            <label className="font-bold text-gray-700">Celular</label>
            <div className="mt-1 text-lg text-gray-800">{formatarTelefone(adminData.telefone)}</div>
          </div>
          <div>
            <label className="font-bold text-gray-700">Status</label>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                adminData.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {adminData.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}