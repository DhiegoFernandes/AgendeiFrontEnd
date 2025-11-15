import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ClientNavbar from "../../components/ClientNavbar";

// Mock dos dados (puxe da API/rota real)
const estabelecimento = "Barbearia Estilo";
const servico = "Corte Masculino";
const cliente = "Maria Costa";

export default function AvaliarServico() {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const maxChars = 280;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Exemplo: envie para a API
    alert(`Avaliação enviada!\nEstrela: ${stars}\nComentário: ${comentario}`);
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      <ClientNavbar />
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-7 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-center tracking-tight">Avaliar Serviço</h1>
      </header>

      {/* Card principal */}
      <main className="w-full flex-1 flex items-center justify-center px-2">
        <form
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl mt-8 mb-8 px-7 py-8 flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          {/* Infos fixas */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Estabelecimento</label>
              <div className="text-lg font-extrabold text-gray-800">{estabelecimento}</div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Serviço</label>
              <div className="text-lg font-bold text-gray-700">{servico}</div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Seu nome</label>
              <div className="text-lg font-bold text-gray-700">{cliente}</div>
            </div>
          </div>

          {/* Estrelas */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">Avaliação</label>
            <div className="flex gap-1 text-3xl">
              {[1,2,3,4,5].map((i) =>
                <button
                  type="button"
                  key={i}
                  aria-label={`Dar nota ${i} estrela${i>1?"s":""}`}
                  className="focus:outline-none"
                  tabIndex={0}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setStars(i)}
                >
                  {(hovered ?? stars) >= i
                    ? <AiFillStar className="text-yellow-400 drop-shadow" />
                    : <AiOutlineStar className="text-gray-300" />}
                </button>
              )}
              <span className="ml-3 text-lg text-gray-400 italic">{stars} estrela{stars!==1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Conte para outros como foi sua experiência&nbsp;
              <span className="font-normal text-sm text-gray-400">(opcional, até {maxChars} caracteres)</span>
            </label>
            <textarea
              maxLength={maxChars}
              required={stars === 0}
              rows={5}
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-300 p-3 text-base text-gray-800 shadow-sm resize-none"
              placeholder="Escreva sua avaliação aqui..."
            />
            <div className="flex justify-end mt-1 text-sm text-gray-400">
              {comentario.length}/{maxChars}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:brightness-105 shadow-xl transition tracking-wide disabled:opacity-60"
            disabled={stars === 0 && comentario.trim().length < 5}
          >
            Enviar Avaliação
          </button>
        </form>
      </main>
    </div>
  );
}