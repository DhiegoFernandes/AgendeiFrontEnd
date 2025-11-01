import { useState, useEffect } from "react";
import { FaMoneyBillTrendUp, FaChartSimple } from "react-icons/fa6";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { HiOutlineXCircle } from "react-icons/hi";
import Header from "../../components/Header";
import { buscarRelatorioFinanceiroMensal, buscarServicosMaisVendidos, buscarEvolucaoMensal, buscarEvolucaoAnual } from "../../services/relatorioService";
import type { RelatorioFinanceiro, ServicoMaisVendido, EvolucaoMensal, EvolucaoAnual } from "../../types/user";
import GraficoEvolucaoMensal from "../../components/GraficoEvolucaoMensal";
import GraficoEvolucaoAnual from "../../components/GraficoEvolucaoAnual";
import { format } from "date-fns";
import { ptBR as ptBRLocale } from "date-fns/locale";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

// Configurar locale padrão do dayjs
dayjs.locale('pt-br');

// Tema customizado com cor roxa para o DatePicker
const purpleTheme = createTheme({
  palette: {
    primary: {
      main: '#9333ea', // purple-600
      dark: '#7e22ce',  // purple-700
    },
  },
});

function ptBR(n: number, isMoney?: boolean) {
  if (isMoney) return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  return n.toLocaleString("pt-BR");
}

export default function RelatorioParceiro() {
  
  // Estados para dados financeiros
  const [dadosFinanceiros, setDadosFinanceiros] = useState<RelatorioFinanceiro>({
    ganhosEsperados: 0,
    ganhosRealizados: 0,
    taxaCancelamentos: 0,
  });
  const [carregandoFinanceiro, setCarregandoFinanceiro] = useState(true);
  
  // Estados para serviços mais vendidos
  const [visualizacaoAtiva, setVisualizacaoAtiva] = useState<"servicos" | "mes" | "ano">("servicos");
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<Dayjs>(dayjs());
  const [servicosMaisVendidos, setServicosMaisVendidos] = useState<ServicoMaisVendido[]>([]);
  const [carregandoServicos, setCarregandoServicos] = useState(true);
  
  // Estados para evolução mensal (gráfico)
  const [evolucaoMensal, setEvolucaoMensal] = useState<EvolucaoMensal[]>([]);
  const [carregandoEvolucaoMensal, setCarregandoEvolucaoMensal] = useState(true);
  
  // Estados para evolução anual (gráfico)
  const [evolucaoAnual, setEvolucaoAnual] = useState<EvolucaoAnual[]>([]);
  const [carregandoEvolucaoAnual, setCarregandoEvolucaoAnual] = useState(true);

  // Carregar dados financeiros do mês atual
  useEffect(() => {
    const carregarDadosFinanceiros = async () => {
      try {
        setCarregandoFinanceiro(true);
        const mesAtual = new Date();
        const dados = await buscarRelatorioFinanceiroMensal(mesAtual);
        setDadosFinanceiros(dados);
      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
        // Em caso de erro, manter valores padrão (0)
      } finally {
        setCarregandoFinanceiro(false);
      }
    };

    carregarDadosFinanceiros();
  }, []);

  // Carregar serviços mais vendidos
  useEffect(() => {
    const carregarServicos = async () => {
      if (visualizacaoAtiva === "servicos") {
        try {
          setCarregandoServicos(true);
          // Converter Dayjs para Date para o serviço
          const dataSelecionada = mesAnoSelecionado.toDate();
          const dados = await buscarServicosMaisVendidos(dataSelecionada);
          setServicosMaisVendidos(dados);
        } catch (error) {
          console.error("Erro ao carregar serviços mais vendidos:", error);
          setServicosMaisVendidos([]);
        } finally {
          setCarregandoServicos(false);
        }
      }
    };

    carregarServicos();
  }, [visualizacaoAtiva, mesAnoSelecionado]);

  // Carregar evolução mensal quando botão "Mês" está ativo
  useEffect(() => {
    const carregarEvolucao = async () => {
      if (visualizacaoAtiva === "mes") {
        try {
          setCarregandoEvolucaoMensal(true);
          const anoAtual = new Date().getFullYear();
          const dados = await buscarEvolucaoMensal(anoAtual);
          setEvolucaoMensal(dados);
        } catch (error) {
          console.error("Erro ao carregar evolução mensal:", error);
          setEvolucaoMensal([]);
        } finally {
          setCarregandoEvolucaoMensal(false);
        }
      }
    };

    carregarEvolucao();
  }, [visualizacaoAtiva]);

  // Carregar evolução anual quando botão "Ano" está ativo
  useEffect(() => {
    const carregarEvolucaoAnual = async () => {
      if (visualizacaoAtiva === "ano") {
        try {
          setCarregandoEvolucaoAnual(true);
          const anoAtual = new Date().getFullYear();
          const anoInicio = anoAtual - 4; // Últimos 5 anos (ano atual - 4 até ano atual)
          const dados = await buscarEvolucaoAnual(anoInicio, anoAtual);
          setEvolucaoAnual(dados);
        } catch (error) {
          console.error("Erro ao carregar evolução anual:", error);
          setEvolucaoAnual([]);
        } finally {
          setCarregandoEvolucaoAnual(false);
        }
      }
    };

    carregarEvolucaoAnual();
  }, [visualizacaoAtiva]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-16">
      {/* Header com alinhamento central */}
        <
          Header
        />

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 mt-15">
        {/* Título do bloco financeiro */}
        <div className="-mt-10 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(new Date(), "MMMM 'de' yyyy", { locale: ptBRLocale }).replace(/^\w/, (c) => c.toUpperCase())}
          </h2>
        </div>
        
        {/* Resumo em cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Ganhos Esperados */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Ganhos Esperados</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {carregandoFinanceiro ? "..." : ptBR(dadosFinanceiros.ganhosEsperados, true)}
                </h2>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <FaMoneyBillTrendUp size={24} />
              </div>
            </div>
          </article>
          
          {/* Card: Ganhos Realizados */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Ganhos Realizados</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {carregandoFinanceiro ? "..." : ptBR(dadosFinanceiros.ganhosRealizados, true)}
                </h2>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <FaMoneyBill1Wave size={24} />
              </div>
            </div>
          </article>
          
          {/* Card: Taxa de Cancelamentos */}
          <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium mb-1">Taxa de Cancelamentos</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {carregandoFinanceiro ? "..." : `${dadosFinanceiros.taxaCancelamentos.toFixed(1)}%`}
                </h2>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <HiOutlineXCircle size={24} />
              </div>
            </div>
          </article>
        </section>

        {/* Controles do período para a tabela abaixo */}
        <div className="mt-10 mb-3">
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shadow-none hover:shadow-lg ${
                visualizacaoAtiva === "servicos" ? "bg-purple-600 text-white" : "bg-white text-purple-700"
              }`}
              onClick={() => setVisualizacaoAtiva("servicos")}
            >
              Os serviços mais vendidos deste mês
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shadow-none hover:shadow-lg ${
                visualizacaoAtiva === "mes" ? "bg-purple-600 text-white" : "bg-white text-purple-700"
              }`}
              onClick={() => setVisualizacaoAtiva("mes")}
            >
              Mês
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shadow-none hover:shadow-lg ${
                visualizacaoAtiva === "ano" ? "bg-purple-600 text-white" : "bg-white text-purple-700"
              }`}
              onClick={() => setVisualizacaoAtiva("ano")}
            >
              Ano
            </button>
          </div>
          
          {/* Seletor de mês e ano - só aparece quando "servicos" está ativo */}
          {visualizacaoAtiva === "servicos" && (
            <div className="flex items-center gap-3 mt-3">
              <ThemeProvider theme={purpleTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Mês e Ano"
                    views={['month', 'year']}
                    value={mesAnoSelecionado}
                    onChange={(newValue) => {
                      if (newValue) {
                        setMesAnoSelecionado(newValue);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#d1d5db', // gray-300 - borda padrão neutra
                            },
                            '&:hover fieldset': {
                              borderColor: '#9333ea', // purple-600 - borda roxa no hover
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#9333ea', // purple-600 - borda roxa quando focado
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                              color: '#9333ea', // purple-600
                            },
                          },
                        },
                      },
                      popper: {
                        sx: {
                          '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: '#9333ea !important', // purple-600
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#7e22ce !important', // purple-700
                            },
                          },
                          '& .MuiPickersMonth-root.Mui-selected': {
                            backgroundColor: '#9333ea !important', // purple-600
                            color: 'white !important',
                            '&:hover': {
                              backgroundColor: '#7e22ce !important', // purple-700
                            },
                          },
                          '& .MuiPickersYear-yearButton.Mui-selected': {
                            backgroundColor: '#9333ea !important', // purple-600
                            color: 'white !important',
                            '&:hover': {
                              backgroundColor: '#7e22ce !important', // purple-700
                            },
                          },
                          '& .MuiIconButton-root': {
                            color: '#9333ea', // purple-600
                            '&:hover': {
                              backgroundColor: 'rgba(147, 51, 234, 0.1)', // purple com opacidade
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
          )}
        </div>

        {/* Serviços mais vendidos - Design mais moderno */}
        {visualizacaoAtiva === "servicos" && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChartSimple className="text-purple-600" size={20} />
                <h2 className="font-bold text-xl text-gray-800">Serviços Mais Vendidos</h2>
              </div>
              <div className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                {mesAnoSelecionado.format('MMMM [de] YYYY').replace(/^\w/, (c) => c.toUpperCase())}
              </div>
            </div>
            
            {/* Lista de serviços */}
            {carregandoServicos ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Carregando...
              </div>
            ) : servicosMaisVendidos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Nenhum serviço encontrado para este período
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="text-left py-4 px-6 font-semibold">Serviço</th>
                      <th className="text-center py-4 px-4 font-semibold">Quantidade</th>
                      <th className="text-right py-4 px-6 font-semibold">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosMaisVendidos.map((servico, index) => (
                      <tr key={servico.tituloServico} className={`${index !== servicosMaisVendidos.length - 1 ? 'border-b' : ''}`}>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {servico.tituloServico}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                            {servico.quantidadeAgendamentos}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-gray-800">
                          {ptBR(servico.totalFaturado, true)}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha de total */}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-4 px-6 text-gray-800">Total</td>
                      <td className="py-4 px-4 text-center text-indigo-700">
                        {servicosMaisVendidos.reduce((acc, s) => acc + s.quantidadeAgendamentos, 0)}
                      </td>
                      <td className="py-4 px-6 text-right text-green-700">
                        {ptBR(servicosMaisVendidos.reduce((acc, s) => acc + s.totalFaturado, 0), true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Gráfico de evolução mensal - aparece quando "Mês" está ativo */}
        {visualizacaoAtiva === "mes" && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChartSimple className="text-purple-600" size={20} />
                <h2 className="font-bold text-xl text-gray-800">Evolução Mensal do Faturamento</h2>
              </div>
              <div className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                {new Date().getFullYear()}
              </div>
            </div>
            
            {carregandoEvolucaoMensal ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : evolucaoMensal.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Nenhum dado disponível para este ano
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <GraficoEvolucaoMensal dados={evolucaoMensal} />
              </div>
            )}
          </section>
        )}

        {/* Gráfico de evolução anual - aparece quando "Ano" está ativo */}
        {visualizacaoAtiva === "ano" && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChartSimple className="text-purple-600" size={20} />
                <h2 className="font-bold text-xl text-gray-800">Evolução Anual do Faturamento</h2>
              </div>
              <div className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                Últimos 5 anos
              </div>
            </div>
            
            {carregandoEvolucaoAnual ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Carregando gráfico...
              </div>
            ) : evolucaoAnual.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center text-gray-500">
                Nenhum dado disponível
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <GraficoEvolucaoAnual dados={evolucaoAnual} />
              </div>
            )}
          </section>
        )}
        
        {/* Botões de ação removidos */}
      </main>
    </div>
  );
}