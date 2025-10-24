import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiOutlineClock, HiOutlineCheck } from "react-icons/hi";
import LogoAgendei from "../../assets/AgendeiHorizontal.png";
import api from "../../services/api";

/* Dias utilitários */
const NOMES_DIAS = [
  { nome: "Domingo", abreviacao: "D", apiValue: "DOMINGO" },
  { nome: "Segunda-feira", abreviacao: "S", apiValue: "SEGUNDA" },
  { nome: "Terça-feira", abreviacao: "T", apiValue: "TERCA" },
  { nome: "Quarta-feira", abreviacao: "Q", apiValue: "QUARTA" },
  { nome: "Quinta-feira", abreviacao: "Q", apiValue: "QUINTA" },
  { nome: "Sexta-feira", abreviacao: "S", apiValue: "SEXTA" },
  { nome: "Sábado", abreviacao: "S", apiValue: "SABADO" },
];

type DisponibilidadeDia = {
  nome: string,
  abreviacao: string,
  apiValue: string,
  inicio: string,
  fim: string,
  ativo: boolean
};

type DisponibilidadeAPI = {
  id: number,
  diaSemana: string,
  horaInicio: string,
  horaFim: string,
  ativo: boolean,
  prestadorId: number,
  nomePrestador: string
};

/* Mock, troque pelo fetch da sua API */
const DISPONIBILIDADE_INICIAL: DisponibilidadeDia[] = NOMES_DIAS.map(dia => ({
  nome: dia.nome,
  abreviacao: dia.abreviacao,
  apiValue: dia.apiValue,
  inicio: "09:00",
  fim: "18:00",
  ativo: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira"].includes(dia.nome),
}));

export default function DisponibilidadePrestador() {
  const [dias, setDias] = useState<DisponibilidadeDia[]>(DISPONIBILIDADE_INICIAL);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingDay, setSavingDay] = useState<number | null>(null);

  // Função para carregar disponibilidades da API
  const carregarDisponibilidades = async () => {
    setLoadingInitial(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticação não encontrado!");
      setLoadingInitial(false);
      return;
    }

    try {
      const response = await api.get('/disponibilidades', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const disponibilidadesAPI: DisponibilidadeAPI[] = response.data;
      
      // Mapear dados da API para o formato local
      const diasAtualizados = DISPONIBILIDADE_INICIAL.map(dia => {
        const disponibilidadeAPI = disponibilidadesAPI.find(d => d.diaSemana === dia.apiValue);
        
        if (disponibilidadeAPI) {
          return {
            ...dia,
            inicio: disponibilidadeAPI.horaInicio.substring(0, 5), // Remove os segundos (09:00:00 -> 09:00)
            fim: disponibilidadeAPI.horaFim.substring(0, 5), // Remove os segundos (21:00:00 -> 21:00)
            ativo: disponibilidadeAPI.ativo
          };
        }
        
        // Dias sem disponibilidade: horários zerados e desativados
        return {
          ...dia,
          inicio: "00:00",
          fim: "00:00",
          ativo: false
        };
      });

      setDias(diasAtualizados);
    } catch (err) {
      console.error('Erro ao carregar disponibilidades:', err);
      setError('Erro ao carregar disponibilidades. Usando configurações padrão.');
    } finally {
      setLoadingInitial(false);
    }
  };

  // Função para salvar horário de um dia específico
  const salvarHorarioDia = async (diaIndex: number) => {
    const dia = dias[diaIndex];
    
    // Verificar se os horários são válidos
    if (dia.inicio === "00:00" && dia.fim === "00:00") {
      setError('Defina horários válidos antes de salvar.');
      return;
    }
    
    if (dia.inicio >= dia.fim) {
      setError('Horário de início deve ser menor que o horário de fim.');
      return;
    }

    setSavingDay(diaIndex);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticação não encontrado!");
      setSavingDay(null);
      return;
    }

    try {
      await api.post('/disponibilidades', {
        diaSemana: dia.apiValue,
        horaInicio: dia.inicio,
        horaFim: dia.fim
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Mostrar feedback de sucesso e recarregar dados
      setPopup(true);
      // Recarregar disponibilidades para manter sincronizado
      setTimeout(() => {
        carregarDisponibilidades();
      }, 1000);
    } catch (err) {
      console.error('Erro ao salvar horário:', err);
      setError('Erro ao salvar horário. Tente novamente.');
    } finally {
      setSavingDay(null);
    }
  };

  // Função para ativar/desativar dia
  const toggleDiaStatus = async (diaIndex: number) => {
    const dia = dias[diaIndex];
    const novoStatus = !dia.ativo;

    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticação não encontrado!");
      return;
    }
    
    // Verificar se o token não está vazio ou malformado
    if (token.trim() === '') {
      setError("Token de autenticação inválido!");
      return;
    }

    try {
      console.log('Enviando PATCH para:', `/disponibilidades/status-dia?dia=${dia.apiValue}&ativo=${novoStatus}`);
      console.log('Token:', token ? 'Token presente' : 'Token ausente');
      
      // Tentar primeiro com PATCH
      const response = await api.patch(`/disponibilidades/status-dia?dia=${dia.apiValue}&ativo=${novoStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta PATCH:', response);

      // Atualizar estado local
      setDias(list => list.map((d, i) =>
        i === diaIndex ? { ...d, ativo: novoStatus } : d
      ));
    } catch (err: any) {
      console.error('Erro ao alterar status do dia com PATCH:', err);
      console.error('Status do erro:', err.response?.status);
      console.error('Dados do erro:', err.response?.data);
      
      // Se PATCH falhar com 403, tentar com GET
      if (err.response?.status === 403 || err.response?.status === 405) {
        try {
          console.log('Tentando com GET...');
          const response = await api.get(`/disponibilidades/status-dia?dia=${dia.apiValue}&ativo=${novoStatus}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Resposta GET:', response);
          
          // Atualizar estado local
          setDias(list => list.map((d, i) =>
            i === diaIndex ? { ...d, ativo: novoStatus } : d
          ));
          
          return; // Sucesso com GET
        } catch (getErr: any) {
          console.error('Erro também com GET:', getErr);
        }
      }
      
      if (err.response?.status === 403) {
        setError('Acesso negado. Verifique suas permissões ou se o token está válido.');
      } else if (err.response?.status === 401) {
        setError('Token inválido ou expirado. Faça login novamente.');
      } else {
        setError('Erro ao alterar status do dia. Tente novamente.');
      }
    }
  };

  useEffect(() => {
    carregarDisponibilidades();
  }, []);

  function handleToggle(idx: number) {
    toggleDiaStatus(idx);
  }
  
  function handleHora(idx: number, campo: "inicio" | "fim", value: string) {
    setDias(list => list.map((d, i) =>
      i === idx ? { ...d, [campo]: value } : d
    ));
  }


  return (
    <div className="min-h-screen bg-[#f6f5fb] flex flex-col items-center">
      {/* Header logo */}
      <header className="w-full bg-white px-5 py-4 shadow flex items-center justify-between rounded-b-2xl mb-6 max-w-4xl mx-auto">
        <img src={LogoAgendei} alt="Agendei" className="w-32 sm:w-38 select-none" />
        <span className="text-purple-600 bg-purple-100 rounded-full p-2">
          <FiUser size={24} />
        </span>
      </header>
      
      <div className="max-w-3xl w-full flex flex-col items-center">
        <section className="w-full flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Atualizar Disponibilidade</h2>
          <p className="text-gray-500 text-base text-center">Defina seus horários de trabalho para cada dia da semana</p>
          <p className="text-gray-400 text-sm text-center mt-2">
            💡 <strong>Dica:</strong> Defina os horários, ative o dia e clique em "Salvar" para cada dia
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </section>

        {loadingInitial ? (
          <div className="w-full bg-white rounded-xl shadow px-6 py-8 flex flex-col items-center justify-center">
            <div className="text-purple-600 text-lg font-semibold mb-2">Carregando disponibilidades...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <section className="availability w-full bg-white rounded-xl shadow px-2 sm:px-6 py-8 flex flex-col gap-4 mb-10">
            {dias.map((dia, idx) => (
              <div key={dia.nome} className="day flex items-center justify-between bg-[#f9f9f9] rounded-xl py-4 px-4 mb-1 shadow-sm gap-4 flex-wrap transition hover:translate-x-1">
                <div className="flex items-center min-w-[165px] mr-5">
                  <span className="day-icon bg-purple-600 text-white w-9 h-9 rounded-full text-lg font-bold shadow flex items-center justify-center mr-3 select-none">{dia.abreviacao}</span>
                  <span className="text-lg font-extrabold text-gray-800">{dia.nome}</span>
                </div>
                <div className="time-select flex flex-col md:flex-row gap-1 md:gap-4 flex-1 min-w-[180px]">
                  <label className="font-semibold text-sm text-gray-700">
                    Início
                    <span className="flex items-center gap-1">
                      <input
                        type="time"
                        value={dia.inicio}
                        onChange={e => handleHora(idx, "inicio", e.target.value)}
                        className={`border rounded px-3 py-1 text-sm w-28 focus:ring-2 focus:ring-purple-400 outline-none mx-1 ${
                          dia.inicio === "00:00" && !dia.ativo 
                            ? "border-gray-200 bg-gray-50 text-gray-400" 
                            : "border-gray-300 bg-white"
                        }`}
                        min="05:00"
                        max="23:00"
                        placeholder="00:00"
                      />
                      <HiOutlineClock className="text-gray-400" />
                    </span>
                  </label>
                  <label className="font-semibold text-sm text-gray-700">
                    Fim
                    <span className="flex items-center gap-1">
                      <input
                        type="time"
                        value={dia.fim}
                        onChange={e => handleHora(idx, "fim", e.target.value)}
                        className={`border rounded px-3 py-1 text-sm w-28 focus:ring-2 focus:ring-purple-400 outline-none mx-1 ${
                          dia.fim === "00:00" && !dia.ativo 
                            ? "border-gray-200 bg-gray-50 text-gray-400" 
                            : "border-gray-300 bg-white"
                        }`}
                        min="05:00"
                        max="23:59"
                        placeholder="00:00"
                      />
                      <HiOutlineClock className="text-gray-400" />
                    </span>
                  </label>
                </div>
                
                {/* Botão Salvar Horário - Sempre visível */}
                <button
                  type="button"
                  onClick={() => salvarHorarioDia(idx)}
                  disabled={savingDay === idx}
                  className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {savingDay === idx ? "Salvando..." : "Salvar"}
                </button>
                
                {/* Toggle */}
                <button
                  tabIndex={0}
                  type="button"
                  aria-pressed={dia.ativo}
                  aria-label="Ativar ou desativar dia"
                  className={`w-16 h-8 bg-gray-200 transition rounded-full border-2 relative ml-auto focus:outline-none cursor-pointer
                    ${dia.ativo ? "bg-purple-500 border-purple-400" : "border-gray-200"}`}
                  style={{ borderColor: dia.ativo ? "#a855f7" : "#e5e7eb" }}
                  onClick={() => handleToggle(idx)}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform cursor-pointer
                      ${dia.ativo ? "transform translate-x-5" : ""}`}
                    style={{
                      transform: dia.ativo ? "translateX(13px)" : "none",
                      transition: "transform 0.5s"
                    }}
                  />
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white px-10 py-8 rounded-2xl shadow-lg flex flex-col items-center animate-fadeIn">
            <HiOutlineCheck size={38} className="text-green-500 mb-3" />
            <span className="text-lg font-bold text-purple-700 mb-2 text-center">
              Disponibilidade atualizada!
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