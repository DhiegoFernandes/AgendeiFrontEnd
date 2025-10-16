import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";

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
  const [cep, setCep] = useState(negocioMock.cep);
  const [endereco, setEndereco] = useState(negocioMock.endereco);
  const [categoria, setCategoria] = useState<string>(negocioMock.categoria);
  const [popup, setPopup] = useState(false);

  // Novos estados para fotos
  const [fotos, setFotos] = useState<File[]>([]);
  // CEP/bin
  function handleCep(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  async function buscarEnderecoPorCep() {
    const soNumeros = cep.replace(/\D/g, "");
    if (soNumeros.length !== 8) return;
    setEndereco("Buscando...");
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${soNumeros}/json/`);
      const data = await resp.json();
      if (data.erro) {
        setEndereco("");
        alert("CEP não encontrado!");
      } else {
        setEndereco(data.logradouro || "");
      }
    } catch {
      setEndereco("");
      alert("Erro ao buscar CEP!");
    }
  }

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPopup(true);
    // Aqui pode enviar as fotos, nome, cep, endereco, categoria ao seu backend
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-purple-600 to-purple-400 px-5 py-5 mb-8 shadow-lg rounded-b-[32px] flex items-center justify-between">
        <button
          className="flex items-center text-white font-bold gap-2 hover:text-purple-200 transition cursor-pointer"
          onClick={() => navigate("/parceiro/perfil")}
        >
          <FiArrowLeft size={22} />
          <span className="text-base">Voltar ao perfil</span>
        </button>
        <span className="text-2xl font-extrabold text-white tracking-wide mx-auto">Atualize seu negócio</span>
        <span className="w-36 hidden sm:block"></span>
      </nav>
      <form className="bg-white max-w-md w-full rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6"
        onSubmit={handleSubmit} autoComplete="off">
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
            onChange={handleCep}
            onBlur={buscarEnderecoPorCep}
            maxLength={9}
            inputMode="numeric"
            
            placeholder="Digite o CEP"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="enderecoNegocio">
            Endereço
          </label>
          <input
            id="enderecoNegocio"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            placeholder="Rua preenchida automaticamente pelo CEP"
            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
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
        {/* Fotos */}
        <div>
          <label className="block font-bold text-gray-700 mb-1" htmlFor="fotosNegocio">
            Fotos do negócio <span className="text-gray-400 font-normal text-xs">(máx. 10)</span>
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
          <div className="flex flex-wrap gap-2 mt-2">
            {fotos.map((file, idx) =>
              <span key={idx} className="relative group block">
                <img
                  src={URL.createObjectURL(file)}
                  alt="foto negócio"
                  className="w-16 h-16 rounded-lg object-cover border-2 border-purple-200"
                />
                <button type="button"
                  onClick={() => removeFoto(idx)}
                  className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 hover:bg-red-500 transition shadow cursor-pointer text-xs"
                  tabIndex={0}
                >✕</button>
              </span>
            )}
          </div>
          {fotos.length >= 10 && (
            <span className="text-xs text-red-500 font-bold">Limite de 10 fotos atingido.</span>
          )}
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:brightness-110 transition cursor-pointer mt-2"
          type="submit"
        >
          Atualizar negócio
        </button>
      </form>
      {/* Popup personalizado */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">
              Dados do negócio atualizados com sucesso!
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