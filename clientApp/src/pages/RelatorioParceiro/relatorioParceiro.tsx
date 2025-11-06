import { useState, useEffect } from "react";
import { FaMoneyBillTrendUp, FaChartSimple } from "react-icons/fa6";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { HiOutlineXCircle } from "react-icons/hi";
import Header from "../../components/Header";
import { buscarRelatorioFinanceiroMensal, buscarServicosMaisVendidos, buscarEvolucaoMensal, buscarEvolucaoAnual, buscarRelatorioNegocio } from "../../services/relatorioService";
import type { RelatorioFinanceiro, ServicoMaisVendido, EvolucaoMensal, EvolucaoAnual, RelatorioNegocio } from "../../types/user";
import api from "../../services/api";
import { FaUsers, FaUser } from "react-icons/fa6";
import GraficoEvolucaoMensal from "../../components/GraficoEvolucaoMensal";
import GraficoEvolucaoAnual from "../../components/GraficoEvolucaoAnual";
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
  
  // Estados para relatório do negócio
  const [relatorioNegocio, setRelatorioNegocio] = useState<RelatorioNegocio | null>(null);
  const [modalPrestadores, setModalPrestadores] = useState(false);
  const [negocioId, setNegocioId] = useState<number | null>(null);
  const [mesAnoRelatorioNegocio, setMesAnoRelatorioNegocio] = useState<Dayjs>(dayjs());

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

  // Buscar ID do negócio do usuário logado
  useEffect(() => {
    async function buscarNegocioId() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const user = response.data;
        const negocio = user.negocio;

        if (negocio && negocio.id) {
          setNegocioId(negocio.id);
        }
      } catch (error) {
        console.error("Erro ao buscar ID do negócio:", error);
      }
    }

    buscarNegocioId();
  }, []);

  // Carregar relatório do negócio quando o ID ou mês/ano mudarem
  useEffect(() => {
    async function carregarRelatorioNegocio() {
      if (!negocioId) return;

      try {
        const ano = mesAnoRelatorioNegocio.year();
        const mes = mesAnoRelatorioNegocio.month() + 1; // dayjs month() retorna 0-11, então +1 para 1-12
        
        const dados = await buscarRelatorioNegocio(negocioId, ano, mes);
        setRelatorioNegocio(dados);
      } catch (error) {
        // Se der erro, não exibe o componente (não seta nada no estado)
        console.error("Erro ao carregar relatório do negócio:", error);
        setRelatorioNegocio(null);
      }
    }

    // Executar quando o negocioId ou mesAnoRelatorioNegocio mudarem
    carregarRelatorioNegocio();
  }, [negocioId, mesAnoRelatorioNegocio]);

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
        <div className="-mt-10 mb-6">
        </div>
        
        {/* Bloco de relatório do negócio - só aparece se houver dados */}
        {relatorioNegocio && (
          <section className="mb-12">
            {/* Cabeçalho do relatório do negócio */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{relatorioNegocio.nomeNegocio}</h2>
                <h3 className="text-lg font-semibold text-gray-600">
                  {mesAnoRelatorioNegocio.format('MMMM [de] YYYY').replace(/^\w/, (c) => c.toUpperCase())}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <ThemeProvider theme={purpleTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DatePicker
                      label="Mês e Ano"
                      views={['month', 'year']}
                      value={mesAnoRelatorioNegocio}
                      onChange={(newValue) => {
                        if (newValue) {
                          setMesAnoRelatorioNegocio(newValue);
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card: Ganhos Totais */}
              <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Ganhos Totais</p>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {ptBR(relatorioNegocio.ganhosTotais, true)}
                    </h2>
                  </div>
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <FaMoneyBillTrendUp size={24} />
                  </div>
                </div>
              </article>
              
              {/* Card: Total de Serviços */}
              <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Total de Serviços</p>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {relatorioNegocio.totalServicos}
                    </h2>
                  </div>
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <FaChartSimple size={24} />
                  </div>
                </div>
              </article>
              
              {/* Card: Ver Prestadores (Botão) */}
              <button
                onClick={() => setModalPrestadores(true)}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Ver Prestadores</p>
                    <h2 className="text-lg font-bold text-purple-600">
                      {relatorioNegocio.prestadores.length} prestador{relatorioNegocio.prestadores.length !== 1 ? 'es' : ''}
                    </h2>
                  </div>
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <FaUsers size={24} />
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}
        
        {/* Divisor visual entre os grupos de cards */}
        {relatorioNegocio && (
          <div className="mb-8 pt-8 border-t-2 border-gray-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Relatório Financeiro Mensal</h2>
          </div>
        )}
        
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

      {/* Modal de Prestadores */}
      {modalPrestadores && relatorioNegocio && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalPrestadores(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaUsers size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Prestadores</h2>
                  <p className="text-sm text-purple-100">{relatorioNegocio.nomeNegocio}</p>
                </div>
              </div>
              <button
                onClick={() => setModalPrestadores(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all cursor-pointer"
                title="Fechar"
              >
                <HiOutlineXCircle size={24} />
              </button>
            </div>
            
            {/* Conteúdo */}
            <div className="p-6">
              {relatorioNegocio.prestadores.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FaUser className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">Nenhum prestador encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">Não há prestadores cadastrados neste negócio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relatorioNegocio.prestadores.map((prestador) => (
                    <div
                      key={prestador.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <FaUser size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{prestador.nome}</h3>
                            <p className="text-xs text-gray-500 font-medium">ID #{prestador.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-green-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <FaMoneyBillTrendUp className="text-green-600" size={16} />
                            <p className="text-sm font-semibold text-gray-600">Ganhos</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {ptBR(prestador.ganhos, true)}
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-2 border-red-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <HiOutlineXCircle className="text-red-600" size={16} />
                            <p className="text-sm font-semibold text-gray-600">Taxa de Cancelamento</p>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            {prestador.taxaCancelamento.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Resumo total */}
                  <div className="mt-6 pt-6 border-t-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <FaChartSimple className="text-purple-600" size={18} />
                      <h3 className="text-lg font-bold text-purple-800">Resumo Geral</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Total de Ganhos</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {ptBR(
                            relatorioNegocio.prestadores.reduce((acc, p) => acc + p.ganhos, 0),
                            true
                          )}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Taxa Média de Cancelamento</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {relatorioNegocio.prestadores.length > 0
                            ? (
                                relatorioNegocio.prestadores.reduce((acc, p) => acc + p.taxaCancelamento, 0) /
                                relatorioNegocio.prestadores.length
                              ).toFixed(1)
                            : "0.0"}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setModalPrestadores(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}