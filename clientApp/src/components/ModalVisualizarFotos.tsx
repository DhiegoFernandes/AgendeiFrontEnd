import { useState, useEffect } from "react";
import api from "../services/api";
import type { FotoNegocio } from "../types/user";

interface ModalVisualizarFotosProps {
  negocioId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onFotoDeletada?: () => void; // Callback opcional quando uma foto é deletada
}

export default function ModalVisualizarFotos({
  negocioId,
  isOpen,
  onClose,
  onFotoDeletada,
}: ModalVisualizarFotosProps) {
  const [fotos, setFotos] = useState<FotoNegocio[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalConfirmarExclusao, setModalConfirmarExclusao] = useState(false);
  const [fotoParaDeletar, setFotoParaDeletar] = useState<FotoNegocio | null>(null);
  const [deletando, setDeletando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // Buscar fotos quando o modal abre
  useEffect(() => {
    if (isOpen && negocioId) {
      buscarFotos();
    } else {
      // Limpar estado quando fechar
      setFotos([]);
      setMensagemErro("");
    }
  }, [isOpen, negocioId]);

  async function buscarFotos() {
    if (!negocioId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMensagemErro("Token de autenticação não encontrado!");
      return;
    }

    setCarregando(true);
    setMensagemErro("");

    try {
      const response = await api.get(`/negocios/${negocioId}/fotos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setFotos(response.data || []);
    } catch (error: any) {
      console.error("Erro ao buscar fotos:", error);
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "";
      setMensagemErro(errorMessage || "Erro ao buscar fotos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function handleAbrirModalConfirmacao(foto: FotoNegocio) {
    setFotoParaDeletar(foto);
    setModalConfirmarExclusao(true);
  }

  function handleFecharModalConfirmacao() {
    setModalConfirmarExclusao(false);
    setFotoParaDeletar(null);
  }

  async function handleConfirmarExclusao() {
    if (!negocioId || !fotoParaDeletar) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMensagemErro("Token de autenticação não encontrado!");
      handleFecharModalConfirmacao();
      return;
    }

    setDeletando(true);

    try {
      await api.delete(`/negocios/${negocioId}/fotos/${fotoParaDeletar.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remover foto da lista local
      setFotos((prev) => prev.filter((f) => f.id !== fotoParaDeletar.id));

      // Chamar callback se fornecido
      if (onFotoDeletada) {
        onFotoDeletada();
      }

      handleFecharModalConfirmacao();
    } catch (error: any) {
      console.error("Erro ao deletar foto:", error);
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "";
      setMensagemErro(errorMessage || "Erro ao deletar foto. Tente novamente.");
      handleFecharModalConfirmacao();
    } finally {
      setDeletando(false);
    }
  }

  // Construir URL completa da foto
  function getFotoUrl(foto: FotoNegocio): string {
    // Se a URL já começa com http, retorna como está
    if (foto.url.startsWith("http")) {
      return foto.url;
    }
    // Caso contrário, adiciona o baseURL da API
    return `${api.defaults.baseURL}${foto.url.replace(/^\//, "")}`;
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Modal principal - Visualizar fotos */}
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col max-w-4xl w-full max-h-[90vh] animate-fadeIn">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">
              Fotos do Negócio
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition cursor-pointer"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>

          {/* Conteúdo */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            {carregando ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-gray-600">Carregando fotos...</p>
              </div>
            ) : mensagemErro ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-red-600 text-center">{mensagemErro}</p>
              </div>
            ) : fotos.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-gray-600">Nenhuma foto encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fotos.map((foto) => (
                  <div
                    key={foto.id}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm hover:shadow-md transition"
                  >
                    {/* Imagem */}
                    <div className="aspect-square w-full">
                      <img
                        src={getFotoUrl(foto)}
                        alt={foto.nomeArquivo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback caso a imagem não carregue
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EErro%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    {/* ID da foto */}
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                      #{foto.id}
                    </div>

                    {/* Botão de deletar */}
                    <button
                      onClick={() => handleAbrirModalConfirmacao(foto)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label={`Deletar foto ${foto.id}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Nome do arquivo (tooltip no hover) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition">
                      {foto.nomeArquivo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {modalConfirmarExclusao && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Deletar foto?
            </h3>
            <p className="text-gray-600 mb-2 text-center">
              Tem certeza que deseja deletar a foto #{fotoParaDeletar?.id}?
            </p>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition cursor-pointer"
                onClick={handleFecharModalConfirmacao}
                disabled={deletando}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmarExclusao}
                disabled={deletando}
              >
                {deletando ? "Deletando..." : "Sim, deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

