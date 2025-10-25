import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../../components/Header";

const CATEGORIAS_FIXAS = ["Cabeleireiro", "Barbearia", "Salão de Beleza", "Manicure"];

const negocioMock = {
  nome: "Barbearia Estilo",
  cep: "01234-567",
  endereco: "Rua dos Barbeiros, 123",
  categoria: "Barbearia"
};

export default function GerenciarNegocio() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nome, setNome] = useState(negocioMock.nome);
  const [cep] = useState(negocioMock.cep); // Removido o setter já que deve ser bloqueado
  const [endereco] = useState(negocioMock.endereco); // Removido o setter já que deve ser bloqueado
  const [categoria, setCategoria] = useState<string>(negocioMock.categoria);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Estados para fotos
  const [fotos, setFotos] = useState<File[]>([]);

  // Handler fotos
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    let newFiles = Array.from(e.target.files);
    if (fotos.length + newFiles.length > 10) newFiles = newFiles.slice(0, 10 - fotos.length);
    setFotos(prev => [...prev, ...newFiles]);
  }
  
  function removeFoto(idx: number) {
    setFotos(list => list.filter((_, i) => i !== idx));
  }

  // Função para atualizar dados do negócio
  function handleSubmitDados(e: React.FormEvent) {
    e.preventDefault();
    setPopupMessage("Dados do negócio atualizados com sucesso!");
    setPopup(true);
    // Lógica para enviar os dados básicos ao backend
  }

  // Função para atualizar fotos
  function handleSubmitFotos(e: React.FormEvent) {
    e.preventDefault();
    setPopupMessage("Fotos do negócio atualizadas com sucesso!");
    setPopup(true);
    // Lógica para enviar as fotos ao backend
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center pb-10">
      {/* Navbar */}
      <Header />

      {/* Container dos Cards */}
      <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4 w-full max-w-6xl mx-auto">
        {/* Card de Atualizar Dados do Negócio */}
        <form 
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitDados} 
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Dados do Negócio</h2>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="nomeNegocio">
              Nome do negócio
            </label>
            <input
              id="nomeNegocio"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome do negócio"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="cepNegocio">
              CEP
            </label>
            <input
              id="cepNegocio"
              value={cep}
              maxLength={9}
              className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-base shadow-sm outline-none cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">O CEP não pode ser alterado</p>
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoNegocio">
              Endereço
            </label>
            <input
              id="enderecoNegocio"
              value={endereco}
              className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-base shadow-sm outline-none cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">O endereço não pode ser alterado</p>
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-1" htmlFor="categoriaNegocio">
              Categoria
            </label>
            <select
              id="categoriaNegocio"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg bg-white text-base focus:ring-2 focus:ring-purple-400 outline-none"
              required
            >
              {CATEGORIAS_FIXAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-auto"
            type="submit"
          >
            Atualizar dados
          </button>
        </form>
        
        {/* Card de Atualizar Fotos */}
        <form 
          className="bg-white w-full lg:w-1/2 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          onSubmit={handleSubmitFotos} 
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Fotos do Negócio</h2>
          
          <div className="flex-1">
            <label className="block font-bold text-gray-700 mb-1" htmlFor="fotosNegocio">
              Adicionar novas fotos <span className="text-gray-400 font-normal text-xs">(máx. 10)</span>
            </label>
            <input
              ref={fileInputRef}
              id="fotosNegocio"
              type="file"
              accept="image/*"
              multiple
              max={10}
              onChange={handleFiles}
              className="w-full rounded-lg border-2 border-purple-200 bg-white py-1.5 px-2.5 shadow-sm cursor-pointer text-base mb-2"
              disabled={fotos.length >= 10}
            />
            
            {fotos.length === 0 ? (
              <div className="mt-4 bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">Nenhuma foto selecionada</p>
                <p className="text-sm text-gray-400 mt-2">Selecione fotos para visualizar aqui</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-4">
                {fotos.map((file, idx) =>
                  <div key={idx} className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFoto(idx)}
                      className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 hover:bg-red-500 transition shadow cursor-pointer text-xs"
                      tabIndex={0}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {fotos.length >= 10 && (
              <p className="text-xs text-red-500 font-bold mt-2">
                Limite de 10 fotos atingido.
              </p>
            )}
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-bold text-purple-800">Dicas para fotos:</h3>
              <ul className="text-xs text-purple-700 mt-1 list-disc pl-5">
                <li>Use fotos bem iluminadas e nítidas</li>
                <li>Mostre o ambiente do seu negócio</li>
                <li>Inclua fotos dos serviços realizados</li>
              </ul>
            </div>
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-auto"
            type="submit"
            disabled={fotos.length === 0}
          >
            Atualizar fotos
          </button>
        </form>
      </div>
      
      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              {popupMessage}
            </span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setPopup(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}