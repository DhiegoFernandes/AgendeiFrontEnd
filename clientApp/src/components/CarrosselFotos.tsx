import { useState, useEffect, useRef } from "react";
import { buscarFotosNegocio, buscarImagemFoto, construirUrlFoto } from "../services/fotoService";
import type { FotoNegocio } from "../types/user";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface CarrosselFotosProps {
  negocioId: number;
  className?: string;
}

export default function CarrosselFotos({ negocioId, className = "" }: CarrosselFotosProps) {
  const [fotos, setFotos] = useState<FotoNegocio[]>([]);
  const [imagens, setImagens] = useState<{ [key: number]: string }>({});
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pausado, setPausado] = useState(false);
  const imagensRef = useRef<{ [key: number]: string }>({});

  useEffect(() => {
    let cancelado = false;

    async function carregarFotos() {
      if (!negocioId) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro(null);

      // Limpar imagens anteriores antes de carregar novas
      Object.values(imagensRef.current).forEach(url => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      imagensRef.current = {};

      try {
        // Buscar lista de fotos
        const fotosLista = await buscarFotosNegocio(negocioId);

        if (cancelado) return;

        if (fotosLista.length === 0) {
          setFotos([]);
          setCarregando(false);
          return;
        }

        setFotos(fotosLista);
        setIndiceAtual(0); // Resetar índice quando carregar novas fotos

        // Carregar cada imagem
        const imagensMapAtual: { [key: number]: string } = {};
        
        for (const foto of fotosLista) {
          if (cancelado) return;
          
          try {
            const blob = await buscarImagemFoto(negocioId, foto.id);
            const url = URL.createObjectURL(blob);
            imagensMapAtual[foto.id] = url;
          } catch (error) {
            console.error(`Erro ao carregar foto ${foto.id}:`, error);
            // Se falhar, usar a URL direta
            imagensMapAtual[foto.id] = construirUrlFoto(foto);
          }
        }

        if (!cancelado) {
          imagensRef.current = imagensMapAtual;
          setImagens(imagensMapAtual);
        } else {
          // Se foi cancelado, limpar as URLs criadas
          Object.values(imagensMapAtual).forEach(url => {
            if (url.startsWith("blob:")) {
              URL.revokeObjectURL(url);
            }
          });
        }
      } catch (error: any) {
        if (!cancelado) {
          console.error("Erro ao carregar fotos:", error);
          setErro("Erro ao carregar fotos");
          setFotos([]);
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregarFotos();

    // Cleanup: revogar URLs de objetos quando o componente desmontar ou negocioId mudar
    return () => {
      cancelado = true;
      // Limpar imagens do ref
      Object.values(imagensRef.current).forEach(url => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      imagensRef.current = {};
      setImagens({});
    };
  }, [negocioId]);

  // Auto-play: passar fotos automaticamente
  useEffect(() => {
    // Só fazer auto-play se houver mais de uma foto e não estiver pausado
    if (fotos.length <= 1 || pausado || carregando) {
      return;
    }

    const interval = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % fotos.length);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [fotos.length, pausado, carregando]);

  // Função para ir para a próxima foto
  const proximaFoto = () => {
    if (fotos.length > 1) {
      setIndiceAtual((prev) => (prev + 1) % fotos.length);
    }
  };

  // Função para ir para a foto anterior
  const fotoAnterior = () => {
    if (fotos.length > 1) {
      setIndiceAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
    }
  };

  // Se estiver carregando
  if (carregando) {
    return (
      <div className={`relative h-44 w-full bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-sm">Carregando fotos...</div>
      </div>
    );
  }

  // Se houver erro ou não houver fotos
  if (erro || fotos.length === 0) {
    return (
      <div className={`relative h-44 w-full bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 text-sm px-4">
          Imagens indisponíveis
        </div>
      </div>
    );
  }

  // Se houver apenas uma foto, não mostrar carrossel
  if (fotos.length === 1) {
    const fotoAtual = fotos[0];
    const urlImagem = imagens[fotoAtual.id] || construirUrlFoto(fotoAtual);

    return (
      <div className={`relative h-44 w-full overflow-hidden ${className}`}>
        <img
          src={urlImagem}
          alt={fotoAtual.nomeArquivo}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback caso a imagem não carregue
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagem indisponível%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
    );
  }

  // Carrossel com múltiplas fotos
  const fotoAtual = fotos[indiceAtual];
  const urlImagem = imagens[fotoAtual.id] || construirUrlFoto(fotoAtual);

  return (
    <div 
      className={`relative h-44 w-full overflow-hidden group ${className}`}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <img
        src={urlImagem}
        alt={fotoAtual.nomeArquivo}
        className="w-full h-full object-cover transition-transform duration-300"
        onError={(e) => {
          // Fallback caso a imagem não carregue
          (e.target as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagem indisponível%3C/text%3E%3C/svg%3E";
        }}
      />

      {/* Botões de navegação */}
      <button
        onClick={fotoAnterior}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100 cursor-pointer z-10"
        aria-label="Foto anterior"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={proximaFoto}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100 cursor-pointer z-10"
        aria-label="Próxima foto"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>

      {/* Indicadores de posição */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {fotos.map((_, index) => (
          <button
            key={index}
            onClick={() => setIndiceAtual(index)}
            className={`h-2 rounded-full transition cursor-pointer ${
              index === indiceAtual
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

