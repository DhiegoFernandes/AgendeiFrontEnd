import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import LogoAgendei from "../../assets/LogoAgendei.png";
import LogoAgendeiVet from "../../assets/LogoVertical.png";
import salaoUm from "../../assets/salaoUm.png";
import salaoDois from "../../assets/salaoDois.png";
import salaoTres from "../../assets/salaoTres.png";

// Importação dos ícones do React Icons
import { HiOutlineMenu, HiLightBulb } from "react-icons/hi";
import { FaMapLocationDot } from "react-icons/fa6";
import { 
  FaBolt, 
  FaClock, 
  FaBriefcase, 
  FaUsers, 
  FaChartBar,
  FaRegStar
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array com as imagens para o slideshow
  const backgroundImages = [salaoUm, salaoDois, salaoTres];

  function handleToggle() {
    setMenuOpen(open => !open);
  }

  function handleNavClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).tagName === "A" && menuOpen) {
      setMenuOpen(false);
    }
  }
  
  // Efeito para alternar as imagens do slideshow a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-5 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Agendei - Início">
            <img src={LogoAgendeiHori} alt="Logo agendei" className="w-[150px] md:w-[200px]" />
          </a>

          {/* Menu Hamburger - Ajustado para melhor visualização em telas menores */}
          <button 
            onClick={handleToggle} 
            className="md:hidden flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-700 rounded-lg"
            aria-expanded={menuOpen}
            aria-controls="nav"
            aria-label="Abrir menu"
          >
            <HiOutlineMenu className="text-xl flex" />
          </button>

          {/* Menu de navegação */}
          <nav 
            onClick={handleNavClick} 
            id="nav" 
            className={`${menuOpen 
              ? "fixed inset-x-0 top-[72px] bg-white shadow-lg transform translate-y-0 opacity-100" 
              : "transform -translate-y-8 opacity-0 pointer-events-none md:transform-none md:opacity-100 md:pointer-events-auto"
            } transition-all duration-200 md:static md:shadow-none`}
            aria-label="Principal"
          >
            <ul className="flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-6 text-base mt-16">
              <li className="w-full md:w-auto"><a href="#inicio" className="block py-3.5 px-5 md:p-0 text-purple-800 font-bold">Início</a></li>
              <li className="w-full md:w-auto"><a href="#cliente" className="block py-3.5 px-5 md:p-0 hover:text-purple-600 transition-colors">Ser Cliente</a></li>
              <li className="w-full md:w-auto"><a href="#prestador" className="block py-3.5 px-5 md:p-0 hover:text-purple-600 transition-colors">Ser Prestador</a></li>
              <li className="hidden md:block w-px h-5 bg-gray-200" aria-hidden="true"></li>
              <li className="w-full md:w-auto">
                <a onClick={() => navigate('/login')} className="block py-3.5 px-5 md:p-0 text-purple-700 cursor-pointer hover:text-purple-800 transition-colors">
                  Entrar
                </a>
              </li>
              <li className="w-full md:w-auto p-4 md:p-0">
                <a 
                  onClick={() => navigate('/cadastro')} 
                  className="block w-full md:w-auto text-center py-3 px-5 md:py-2.5 md:px-4 bg-purple-600 text-white font-bold rounded-xl md:rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Cadastrar
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section 
          className="relative overflow-hidden text-white py-16 md:py-20 lg:py-24"
          aria-labelledby="ttl-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(92, 57, 194, 0.85), rgba(124, 78, 255, 0.9)), url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s ease-in-out'
          }}
        >
          <div className="container mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 
                  id="ttl-hero" 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                >
                  Simplifique seus <span className="text-orange-300">Agendamentos</span>
                </h1>
                <p className="text-indigo-100 text-lg mb-6">
                  Conecte clientes e prestadores de serviço de forma rápida, fácil e segura.
                  O futuro dos agendamentos está aqui.
                </p>
                <div className="flex gap-4">
                  <a href="#sobre" className="px-6 py-3.5 font-bold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors">
                    Saiba Mais
                  </a>
                </div>
              </div>

              <aside 
                className="bg-white text-gray-800 rounded-2xl shadow-xl p-5 max-w-md mx-auto w-full animate-float" 
                aria-label="Próximo agendamento"
                style={{
                  animation: 'float 3s ease-in-out infinite alternate'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={LogoAgendei} alt="Logo agendei" className="w-[50px]" />
                  <div>
                    <div className="font-bold">Próximo Agendamento</div>
                    <div className="text-sm text-gray-500">Hoje, 14:30</div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="mb-2">
                    <div className="font-bold">Corte + Barba</div>
                    <div className="text-sm text-gray-500">Barbearia do João</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-extrabold">R$ 40,00</span>
                    <span className="text-sm text-gray-500">45 min</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          
          <span className="absolute right-1/4 top-1/4 w-56 h-56 rounded-full bg-gradient-radial from-white/15 to-transparent" aria-hidden="true"></span>
          <span className="absolute right-[6%] top-1/3 w-40 h-40 rounded-full bg-gradient-radial from-white/15 to-transparent" aria-hidden="true"></span>
        </section>

        <section id="sobre" className="py-16" aria-labelledby="ttl-sobre">
          <div className="container mx-auto px-5">
            <header className="text-center mb-10">
              <h2 id="ttl-sobre" className="text-3xl font-bold mb-2">Nossa História</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Nascemos da necessidade de simplificar a vida de quem oferece e de quem busca serviços</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
              <article className="bg-white rounded-2xl shadow p-6 flex gap-4 items-start">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiLightBulb className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">A Ideia</h3>
                  <p className="text-gray-600">
                    Em 2023, percebemos que tanto clientes quanto prestadores de serviço enfrentavam dificuldades
                    para se conectar de forma eficiente: ligações perdidas, horários desencontrados e falta de
                    organização eram problemas constantes.
                  </p>
                </div>
              </article>

              <article className="bg-white rounded-2xl shadow p-6 flex gap-4 items-start">
                <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaBolt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">A Solução</h3>
                  <p className="text-gray-600">
                    Criamos uma plataforma que conecta pessoas de forma inteligente, permitindo agendamentos rápidos,
                    gestão eficiente de horários e uma experiência simples e moderna. Hoje, milhares confiam no Agendei.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="cliente" className="py-16 bg-gray-50" aria-labelledby="ttl-cliente">
          <div className="container mx-auto px-5">
            <header className="text-center mb-10">
              <h2 id="ttl-cliente" className="text-3xl font-bold mb-2">Por que devo ser cliente no Agendei?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Descubra como o Agendei facilita sua vida ao conectar você aos melhores profissionais de estética e beleza da sua região.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <FaClock className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Agendamento Fácil e Rápido</h3>
                <p className="text-gray-600">Escolha o serviço, veja horários disponíveis em tempo real e confirme o agendamento em poucos cliques.</p>
              </article>

              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                  <FaMapLocationDot className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Busque por Localização</h3>
                <p className="text-gray-600">Encontre profissionais e estabelecimentos próximos. Visualize o endereço no mapa e calcule o tempo de deslocamento.</p>
              </article>

              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <FaRegStar className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Avaliações e Experiências</h3>
                <p className="text-gray-600">Veja avaliações de outros clientes e escolha prestadores de confiança com base na reputação e qualidade do serviço.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="prestador" className="py-16 bg-white" aria-labelledby="ttl-prestador">
          <div className="container mx-auto px-5">
            <header className="text-center mb-10">
              <h2 id="ttl-prestador" className="text-3xl font-bold mb-2">Por que anunciar seu negócio no Agendei?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Transforme sua forma de atender e conquiste mais clientes com uma plataforma moderna e eficiente.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <FaBriefcase className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gestão de Serviços e Agenda</h3>
                <p className="text-gray-600">Controle seus agendamentos, bloqueie horários e visualize sua disponibilidade de forma simples e automatizada.</p>
              </article>

              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                  <FaUsers className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Equipe Colaborativa</h3>
                <p className="text-gray-600">Convide outros prestadores para o seu negócio. Cada profissional pode gerenciar seus próprios horários e serviços.</p>
              </article>

              <article className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <FaChartBar className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Relatórios e Desempenho</h3>
                <p className="text-gray-600">Acompanhe seus resultados com relatórios de serviços e agendamentos. Entenda o que está funcionando e otimize seu atendimento.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-gray-200 pt-12 pb-6">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src={LogoAgendeiVet} alt="Logo Agendei" className="w-[100px]" />
              </div>
              <p className="text-gray-400 mb-6">
                Conectando pessoas e simplificando agendamentos em todo o Brasil.
              </p>
            </div>

            <nav aria-label="Links Rápidos">
              <h4 className="text-lg font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-3">
                <li><a href="#sobre" className="hover:text-white hover:underline transition-colors">Sobre Nós</a></li>
              </ul>
            </nav>

            <nav aria-label="Suporte">
              <h4 className="text-lg font-bold mb-4">Suporte</h4>
              <ul className="space-y-3">
                <li><a href="/politicaPrivacidade" className="hover:text-white hover:underline transition-colors">Termos de Uso e Políticas de Privacidade</a></li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <small>© {new Date().getFullYear()} Agendei. Todos os direitos reservados.</small>
          </div>
        </div>
      </footer>
      
      {/* Estilo para a animação de flutuação */}
      <style >{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}

export default Home;