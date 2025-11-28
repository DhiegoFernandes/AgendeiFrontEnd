import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineStar, HiOutlineClock, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineCog
} from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { FaRegHandshake } from "react-icons/fa6";
import { PiScissorsDuotone } from "react-icons/pi";
import { FaChartColumn } from "react-icons/fa6";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { FaUserSlash } from "react-icons/fa";
import api from "../../services/api";
import { obterMetricasAgendamentos } from "../../services/metricasService";
import type { MetricasAgendamento } from "../../types/user";
import LogoutButton from "../../components/LogoutButton";

function getInitials(name: string) {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const n = name.trim().split(" ").filter(word => word.length > 0);

  if (n.length >= 2) {
    return (n[0][0] + n[1][0]).toUpperCase();
  } else if (n.length === 1) {
    return n[0][0].toUpperCase();
  }
  return null;
}

// KPIs serão criados dinamicamente com base nas métricas dos agendamentos

export default function PerfilPrestador() {
  const navigate = useNavigate();

  // Modal convidar parceiro
  const [modalConvite, setModalConvite] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [convitePopup, setConvitePopup] = useState<string | false>(false);
  const [negocio, setNegocio] = useState("");
  const [profissional, setProfissional] = useState("");
  const [categoria, setCategoria] = useState("");
  const [notaMedia, setNotaMedia] = useState<number | null>(null);
  const [fotoPrestador, setFotoPrestador] = useState<string | null>(null);

  // Estados para métricas dos agendamentos
  const [metricas, setMetricas] = useState<MetricasAgendamento>({
    agendamentosHoje: 0,
    agendamentosPendentes: 0,
    agendamentosPendentesSemana: 0,
    agendamentosConcluidosMes: 0,
    agendamentosConcluidosHoje: 0,
  });
  const [carregandoMetricas, setCarregandoMetricas] = useState(true);

  // Função para carregar métricas dos agendamentos
  const carregarMetricas = async () => {
    try {
      setCarregandoMetricas(true);
      const dadosMetricas = await obterMetricasAgendamentos();
      setMetricas(dadosMetricas);
    } catch (error) {
      console.error("Erro ao carregar métricas dos agendamentos:", error);
      // Em caso de erro, manter valores padrão (0)
    } finally {
      setCarregandoMetricas(false);
    }
  };

  useEffect(() => {
    async function buscarDadosUsuario() {
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

        // Validar se o negócio existe
        if (!negocio || !negocio.id) {
          console.error("Negócio não encontrado para o usuário");
          navigate("/prestador/escolha");
          return;
        }

        // Se o negócio está desativado, redirecionar para escolher plano
        if (!negocio.ativo) {
          navigate("/prestador/criar-negocio?escolherPlano=true");
          return;
        }

        // Definir dados básicos do negócio
        setNegocio(negocio.nome || "");
        setProfissional(user.nome || "");
        setCategoria(negocio.categoria || "");

        console.log("Usuário carregado:", user);

        // Buscar foto de perfil do prestador
        try {
          const fotoUrlResponse = await api.get(`/usuarios/${user.id}/foto-perfil-url`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          const fotoUrlData = fotoUrlResponse.data;

          // Se houver URL da foto, buscar a imagem
          if (fotoUrlData && fotoUrlData.urlFoto) {
            try {
              const fotoBlobResponse = await api.get(fotoUrlData.urlFoto, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              });

              // Converter blob para URL para exibição
              if (fotoBlobResponse.data && fotoBlobResponse.data.size > 0) {
                const imageUrl = URL.createObjectURL(fotoBlobResponse.data);
                setFotoPrestador(imageUrl);
                console.log("Foto do prestador carregada com sucesso");
              } else {
                setFotoPrestador(null);
              }
            } catch (fotoBlobError) {
              console.log("Erro ao buscar foto do prestador:", fotoBlobError);
              setFotoPrestador(null);
            }
          } else {
            setFotoPrestador(null);
          }
        } catch (fotoUrlError) {
          // Se não houver foto, simplesmente não definir fotoPrestador (permanece null)
          console.log("Foto de perfil do prestador não encontrada ou indisponível");
          setFotoPrestador(null);
        }

        // Segunda chamada para buscar dados do negócio incluindo nota média
        try {
          const negocioResponse = await api.get(`/negocios/${negocio.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          const negocioData = negocioResponse.data;
          setNotaMedia(negocioData.notaMedia || null);

          console.log("Dados do negócio carregados:", negocioData);
        } catch (negocioError) {
          console.error("Erro ao buscar dados do negócio:", negocioError);
          // Continua mesmo se falhar
        }

      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    buscarDadosUsuario();
    carregarMetricas();
  }, [])

  function handleClickConvidar() {
    setModalConvite(true);
    setEmailConvite("");
  }

  async function handleEnviarConvite(e: React.FormEvent) {
    e.preventDefault();
    if (!emailConvite.match(/^[\w-.]+@[\w-.]+\.[a-zA-Z]{2,}$/)) {
      setConvitePopup("E-mail inválido!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await api.post("/negocios/convidar", { emailPrestador: emailConvite }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      setModalConvite(false);
      setConvitePopup("Convite enviado!");
      setEmailConvite("");
    } catch (error: any) {
      console.error("Erro ao enviar convite:", error);
      const errorMessage = error?.response?.data?.errorMessage || "Erro ao enviar convite. Tente novamente.";
      setModalConvite(false);
      setConvitePopup(errorMessage);
      setEmailConvite("");
    }
  }

  const shortcuts = [
    {
      label: "Agendamentos",
      desc: "Gerencie sua agenda",
      icon: <HiOutlineCalendar size={28} className="text-purple-500" />,
      highlight: carregandoMetricas ? undefined : (metricas.agendamentosPendentes > 0 ? metricas.agendamentosPendentes : undefined),
      onClick: () => navigate("/parceiro/agendamento"),
    },
    {
      label: "Relatórios",
      desc: "Análise de desempenho",
      icon: <FaChartColumn size={26} className="text-blue-500" />,
      onClick: () => navigate("/parceiro/relatorio"),
    },
    {
      label: "Serviços",
      desc: "Cadastre e edite",
      icon: <PiScissorsDuotone size={26} className="text-pink-500" />,
      onClick: () => navigate("/parceiro/servicos"),
    },
    {
      label: "Disponíbilidade",
      desc: "Gerencie seus dias e horários",
      icon: <HiOutlineCog size={26} className="text-gray-500" />,
      onClick: () => navigate("/parceiro/horarioDeTrabalhoParceiro"),
    },
    {
      label: "Convidar parceiro",
      desc: "Gerencie convites",
      icon: <FaRegHandshake size={24} className="text-yellow-500" />,
      onClick: handleClickConvidar,
    },
    {
      label: "Avaliações",
      desc: "Veja as avaliações",
      icon: <AiFillStar size={26} className="text-yellow-400" />,
      onClick: () => navigate("/parceiro/avaliações"),
    },
    {
      label: "Gerenciar negócio", // <-- ALTERADO
      desc: "Gerencie seu negócio", // <-- ALTERADO
      icon: <BsFillPersonLinesFill size={24} className="text-purple-400" />,
      onClick: () => navigate("/parceiro/gerenciar-negocio"), // <-- ALTERADO
    },
    {
      label: "Gerenciar Perfil",
      desc: "Gerencie seu Perfil",
      icon: <MdManageAccounts size={24} className="text-blue-400" />,
      onClick: () => navigate("/parceiro/gerenciar-perfil"), // <-- ALTERADO
    },
    {
      label: "Usuários do Negócio",
      desc: "Gerencie bloqueios de clientes",
      icon: <FaUserSlash size={24} className="text-red-500" />,
      onClick: () => navigate("/parceiro/usuarios-bloqueados"),
    },
  ];

  // Função para criar KPIs dinamicamente baseado nas métricas
  const criarKPIs = () => {
    return [
      {
        label: "Concluídos (hoje)",
        value: carregandoMetricas ? "..." : metricas.agendamentosConcluidosHoje,
        subtitle: "Agendamentos",
        icon: <HiOutlineCalendar size={26} className="text-purple-500" />
      },
      {
        label: "Pendentes (hoje)",
        value: carregandoMetricas ? "..." : metricas.agendamentosPendentes,
        subtitle: "Agendamentos",
        icon: <HiOutlineClock size={26} className="text-yellow-400" />
      },
      {
        label: "Este mês",
        value: carregandoMetricas ? "..." : metricas.agendamentosConcluidosMes,
        subtitle: "Concluídos",
        icon: <HiOutlineTrendingUp size={26} className="text-green-500" />
      },
    ];
  };

  return (
    <div className="bg-[#f6f5fb] min-h-screen">
      {/* Hero/Header */}
      <header className="w-full bg-gradient-to-br from-purple-600 to-purple-400 shadow-md relative px-4 py-8 rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <h1 className="text-white font-extrabold text-3xl sm:text-4xl mb-2 drop-shadow-lg">{negocio}</h1>
            <div className="flex items-center gap-5 mt-2">
              <div
                className="w-14 h-14 rounded-full bg-white/25 text-2xl text-white font-extrabold flex items-center justify-center shadow ring-2 ring-white/20 select-none uppercase overflow-hidden cursor-pointer 
             transition-transform transform hover:scale-105 hover:shadow-2xl"
                onClick={() => navigate("/parceiro/gerenciar-perfil")}
              >
                {fotoPrestador ? (
                  <img
                    src={fotoPrestador}
                    alt="Foto do prestador"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(profissional)
                )}
              </div>

              <div>
                <span className="font-bold text-lg text-white">{profissional}</span>
                <span className="block text-white/80 text-sm">{categoria}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 mt-6 lg:mt-0">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl gap-2 backdrop-blur">
              <HiOutlineStar className="text-yellow-300" size={23} />
              <span className="font-bold text-lg text-white drop-shadow">
                {notaMedia !== null ? notaMedia.toFixed(1) : "N/A"}
              </span>
            </div>
            <div className="flex gap-3">
              <LogoutButton
                variant="default"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur shadow-lg"
                showIcon={true}
                showText={true}
              />
            </div>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 mt-10 px-2">
        {criarKPIs().map((kpi) => (
          <article key={kpi.label} className="rounded-xl bg-white py-6 px-6 flex flex-col items-start shadow group">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-600 text-base">{kpi.label}</span>{kpi.icon}
            </div>
            <div className="text-3xl font-extrabold text-purple-700 drop-shadow-xl animate-fadeIn">{kpi.value}</div>
            <div className="text-gray-400 text-xs">{kpi.subtitle}</div>
          </article>
        ))}
      </section>

      {/* Atalhos */}
      <section className="max-w-5xl mx-auto mt-12 px-2 mb-2">
        <div className="flex flex-col mb-6 px-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Gerenciar Negócio</h2>
          <p className="mt-1 text-gray-500">Atalhos para tudo que você usa no dia a dia</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortcuts.map(opt =>
            <button
              key={opt.label}
              className="relative bg-white rounded-2xl px-8 py-7 flex flex-col items-start gap-1 overflow-hidden shadow-lg hover:shadow-2xl transition group focus:outline-none cursor-pointer"
              onClick={opt.onClick}
              tabIndex={0}
              aria-label={opt.label}
            >
              <div className="flex items-center gap-3 mb-1">
                {opt.icon}
                <span className="text-lg font-extrabold text-gray-700 group-hover:text-purple-700 transition">{opt.label}</span>
                {opt.highlight &&
                  <span className="inline-flex ml-2 bg-red-500 text-white rounded-full px-2 h-6 items-center text-xs font-bold animate-bounce">{opt.highlight}</span>}
              </div>
              <span className="text-[15px] text-gray-500 font-medium">{opt.desc}</span>
            </button>
          )}
        </div>
      </section>

      {/* MODAL: Convidar Parceiro */}
      {modalConvite && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <form
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-6 animate-fade-in"
            onSubmit={handleEnviarConvite}
            autoComplete="off"
          >
            {/* Título */}
            <h2 className="text-2xl font-extrabold text-purple-700 text-center">
              Convidar Parceiro
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-600 text-center -mt-3 mb-2 text-sm">
              Envie um convite para outro prestador se juntar ao seu negócio.
            </p>

            {/* Campo de e-mail */}
            <div className="w-full">
              <label className="text-gray-700 font-semibold text-sm mb-1 block">
                Informe o e-mail do parceiro:
              </label>

              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-50 transition-all placeholder-gray-400"
                placeholder="exemplo@email.com"
                value={emailConvite}
                onChange={e => setEmailConvite(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 w-full pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                Enviar convite
              </button>

              <button
                type="button"
                onClick={() => setModalConvite(false)}
                className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Popup central para feedback */}
      {convitePopup && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white px-9 py-10 rounded-2xl shadow-lg flex flex-col items-center">
            <span className="text-xl font-bold text-purple-700 mb-5 text-center">{convitePopup}</span>
            <button
              className="mt-2 px-10 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow hover:brightness-105 transition cursor-pointer"
              onClick={() => setConvitePopup(false)}>
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}