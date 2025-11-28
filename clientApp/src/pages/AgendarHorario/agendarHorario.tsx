import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, formatISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import salaoDois from "../../assets/salaoDois.png"
import { HiOutlineCalendar, HiOutlineClock, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import api from "../../services/api";
import ClientNavbar from "../../components/ClientNavbar";

// Interface para os horários disponíveis da API
interface HorariosDisponiveis {
  servicoId: number;
  diasDisponiveis: {
    dia: string;
    horarios: string[];
  }[];
}

export default function AgendarHorario() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados vindos da navegação
  const servicoId = location.state?.servicoId as number | undefined;
  const negocioId = location.state?.negocioId as number | undefined;
  const servicoNome = location.state?.servicoNome as string | undefined;
  const servicoValor = location.state?.servicoValor as number | undefined;
  const servicoDuracao = location.state?.servicoDuracao as number | undefined;
  
  const [data, setData] = useState<Date>(new Date());
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState<string | null>(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [erroHorarios, setErroHorarios] = useState<string | null>(null);
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  
  // Validar se servicoId foi passado
  useEffect(() => {
    if (!servicoId) {
      setErroHorarios("Serviço não selecionado. Redirecionando...");
      setTimeout(() => navigate("/cliente/escolher-servico", { state: { negocioId } }), 2000);
    }
  }, [servicoId, negocioId, navigate]);
  
  // Dados do negócio e prestador (serão buscados da API)
  const [negocioNome, setNegocioNome] = useState<string>("");
  const [prestadorNome, setPrestadorNome] = useState<string>(location.state?.nomePrestador || "");
  const [notaMedia, setNotaMedia] = useState<number | null>(null);

  // Buscar dados do negócio ao carregar
  useEffect(() => {
    async function carregarDadosNegocio() {
      if (!negocioId) {
        setErroHorarios("ID do negócio não encontrado. Redirecionando...");
        setTimeout(() => navigate("/cliente/comercios"), 2000);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setErroHorarios("Token não encontrado. Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await api.get(`/negocios/${negocioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        setNegocioNome(response.data.nome || "");
        setNotaMedia(response.data.notaMedia || null);
      } catch (error) {
        console.error("Erro ao carregar dados do negócio:", error);
      }
    }

    carregarDadosNegocio();
  }, [negocioId, navigate]);

  // Buscar horários disponíveis sempre que a data ou serviço mudar
  useEffect(() => {
    async function buscarHorariosDisponiveis() {
      if (!servicoId) {
        setHorarios([]);
        return;
      }

      setLoadingHorarios(true);
      setErroHorarios(null);
      setHora(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setErroHorarios("Token não encontrado");
        setLoadingHorarios(false);
        return;
      }

      try {
        const dataFormatada = format(data, "yyyy-MM-dd");
        const url = `/servicos/${servicoId}/horarios-disponiveis-data?data=${dataFormatada}`;
        
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const dados: HorariosDisponiveis = response.data;

        // A API já retorna os horários para a data específica consultada
        if (dados.diasDisponiveis && dados.diasDisponiveis.length > 0) {
          const horariosDisponiveis = dados.diasDisponiveis[0].horarios;
          setHorarios(horariosDisponiveis);
        } else {
          setHorarios([]);
        }
      } catch (error: any) {
        console.error("Erro ao buscar horários disponíveis:", error);
        setErroHorarios("Erro ao buscar horários disponíveis");
        setHorarios([]);
      } finally {
      setLoadingHorarios(false);
      }
    }

    buscarHorariosDisponiveis();
  }, [data, servicoId]);

  // Função para confirmar o agendamento
  async function handleAgendar() {
    if (!servicoId) {
      setErroHorarios("Serviço não selecionado. Por favor, volte e selecione um serviço.");
      setShowConfirmacao(false);
      return;
    }

    if (!hora) {
      setErroHorarios("Por favor, selecione um horário.");
      setShowConfirmacao(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErroHorarios("Token não encontrado. Por favor, faça login novamente.");
      setShowConfirmacao(false);
      return;
    }

    try {
      // Combinar data e hora selecionados
      const dataFormatada = format(data, "yyyy-MM-dd");
      const dataHoraCompleta = `${dataFormatada}T${hora}:00`;
      
      console.log("Criando agendamento:", { servicoId, dataHora: dataHoraCompleta });
      
      // Requisição POST para criar o agendamento
      await api.post("/agendamentos", {
        servicoId: servicoId,
        dataHora: dataHoraCompleta
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Fechamos o modal e redirecionamos
      setShowConfirmacao(false);
      navigate("/cliente/agendamento");
    } catch (error: any) {
      console.error("Erro ao realizar agendamento:", error);
      const errorMessage = error.response?.data?.message || error.message || "Erro ao confirmar agendamento. Tente novamente.";
      setErroHorarios(errorMessage);
      setShowConfirmacao(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5fb] pb-24">
      <ClientNavbar />
      {/* TOPBAR GRADIENTE */}

      {/* CARD PROFISSIONAL */}
      <section className="max-w-2xl mx-auto mt-8 flex flex-col gap-6 px-4">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow px-8 py-6 justify-between">
          <div className="flex items-center gap-6 w-full">
            <img
              src={salaoDois}
              alt=""
              className="w-20 h-20 object-cover rounded-xl border bg-gray-50"
            />
            <div className="flex flex-col flex-1">
              <h3 className="font-extrabold text-2xl text-gray-900">{prestadorNome || "Prestador"}</h3>
              <p className="text-gray-600 flex items-center gap-2 font-semibold mt-1">
                {notaMedia !== null && notaMedia !== undefined && (
                  <span className="text-yellow-500 text-lg">★ {notaMedia.toFixed(1)}</span>
                )}
                {negocioNome && <span>{negocioNome}</span>}
              </p>
              {servicoNome && servicoValor && servicoDuracao && (
              <p className="text-gray-700 mt-1">
                  {servicoNome} — R$ {servicoValor.toFixed(2)} · {servicoDuracao} min
              </p>
              )}
            </div>
          </div>
          <button
            className="ml-0 md:ml-4 px-4 py-2 font-bold text-purple-600 border-2 border-purple-200 bg-white rounded-lg shadow hover:bg-purple-50 transition whitespace-nowrap mt-4 md:mt-0"
            onClick={() => navigate("/cliente/escolher-servico", { state: { negocioId } })}
          >
            Trocar serviço
          </button>
        </div>

        {/* CARD CALENDÁRIO */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <label className="block font-bold text-lg mb-4">Selecione uma data</label>
          <div className="flex justify-center items-center">
          <DayPicker
            mode="single"
            selected={data}
            onSelect={d => d && setData(d)}
            locale={ptBR}
            weekStartsOn={0}
            fromDate={new Date()}
            modifiersClassNames={{
              selected: "bg-purple-500 text-white !rounded-lg",
              today: "text-purple-600 font-bold",
            }}
              className="mx-auto"
            classNames={{
              head_row: "text-gray-500 font-bold",
                month: "mx-auto",
                caption: "flex justify-center",
            }}
          />
          </div>
        </div>

        {/* CARD horários */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-3">
            <h3 className="font-bold text-xl text-gray-800">Horários disponíveis</h3>
            <span className="text-sm text-gray-400">
              {format(data, "PPPP", { locale: ptBR })}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {loadingHorarios && (
              <span className="col-span-full text-center text-purple-600 animate-pulse py-6">Carregando horários...</span>
            )}
            {erroHorarios && (
              <span className="col-span-full text-center text-red-500 py-6">{erroHorarios}</span>
            )}
            {!loadingHorarios && !erroHorarios && horarios.length > 0 && horarios.map(hr => (
              <button
                key={hr}
                className={`py-2 px-3 rounded-xl text-base font-bold border-2 transition
                  ${hora === hr
                    ? "border-purple-500 bg-purple-50 text-purple-800"
                    : "border-gray-200 bg-white hover:bg-purple-100"}
                `}
                onClick={() => setHora(hr)}
              >
                {hr}
              </button>
            ))}
            {!loadingHorarios && !erroHorarios && horarios.length === 0 && (
              <span className="col-span-full text-center text-gray-500 py-6">
                {data.getDay() === 0 
                  ? "Não funciona aos domingos" 
                  : "Sem horários disponíveis para esta data"}
              </span>
            )}
          </div>
        </div>

        {/* CARD RESUMO */}
        <div className="bg-white mt-2 rounded-2xl shadow px-8 py-6">
          <h3 className="font-extrabold text-xl mb-4">Resumo</h3>
          <div className="flex flex-col gap-2 text-base">
            {servicoNome && (
              <span>Serviço: <span className="font-extrabold">{servicoNome}</span></span>
            )}
            {prestadorNome && (
              <span>Profissional: <span className="font-extrabold">{prestadorNome}</span></span>
            )}
            <span>
              Data:{" "}
              <span className="font-extrabold">
                {format(data, "PPPP", { locale: ptBR })}
              </span>
            </span>
            <span>
              Horário:{" "}
              <span className="font-extrabold">
                {hora || "—"}
              </span>
            </span>
            {servicoValor && (
            <div className="flex justify-between mt-2 text-xl font-extrabold">
              <span className="text-purple-700">Valor total:</span>
              <span className="text-purple-700">
                  R$ {servicoValor.toFixed(2)}
              </span>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Botão rodapé fixo */}
      <footer className="fixed left-0 right-0 bottom-0 flex justify-center z-30 bg-opacity-0 pointer-events-none">
        <button
          className={`pointer-events-auto w-full max-w-2xl bg-purple-600 h-14 text-white text-lg font-bold rounded-xl shadow-lg mb-4 mx-2
                      transition focus:ring-4 ring-purple-300
                      ${!hora ? "opacity-60 cursor-not-allowed" : "hover:bg-purple-700 cursor-pointer"}`}
          disabled={!hora}
          onClick={() => setShowConfirmacao(true)}
        >
          Confirmar Agendamento
        </button>
      </footer>

      {/* Modal de confirmação personalizado */}
      {showConfirmacao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-5">
              <HiOutlineCheck className="text-purple-600 text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Confirmar Agendamento</h3>
            
            <p className="text-gray-600 text-center mb-6">
              Você está agendando um horário para o serviço abaixo:
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <img 
                    src={salaoDois} 
                    alt={prestadorNome || "Prestador"} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                <h4 className="font-bold text-gray-800">{servicoNome || "Serviço"}</h4>
                {prestadorNome && (
                  <p className="text-gray-600 text-sm">Com {prestadorNome}</p>
                )}
                </div>
              {servicoValor && (
                <div className="ml-auto">
                  <p className="font-bold text-purple-700">R$ {servicoValor.toFixed(2)}</p>
                </div>
              )}
              </div>
              
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="text-purple-600" />
                  <span className="text-gray-700">{format(data, "PPPP", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineClock className="text-purple-600" />
                  <span className="text-gray-700">Horário: {hora}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmacao(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <HiOutlineX /> Cancelar
              </button>
              <button 
                onClick={handleAgendar}
                className="flex-1 py-3 px-4 bg-purple-600 rounded-xl font-semibold text-white hover:bg-purple-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <HiOutlineCheck /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}