import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home-style.css";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";
import LogoAgendei from "../../assets/LogoAgendei.png";
import LogoAgendeiVet from "../../assets/LogoVertical.png";


function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleToggle() {
    setMenuOpen(open => !open);
  }

  function handleNavClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).tagName === "A" && menuOpen) {
      setMenuOpen(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#inicio" className="brand" aria-label="Agendei - Início">
            <img src={LogoAgendeiHori} alt="Logo agendei" width="200px" />
          </a>

          <button onClick={handleToggle} className="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu">☰</button>

          <nav onClick={handleNavClick} id="nav" className={`nav${menuOpen ? " open" : ""}`} aria-label="Principal">
            <ul className="nav-list">
              <li><a href="#inicio" className="active">Início</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#cliente">Ser Cliente</a></li>
              <li><a href="#prestador">Ser Prestador</a></li>
              <li className="sep" aria-hidden="true"></li>
              <li><a onClick={() => navigate('/login')} className="link">Entrar</a></li>
              <li><a onClick={() => navigate('/cadastro')} className="btn primary">Cadastrar</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="inicio">

        <section className="hero" aria-labelledby="ttl-hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1 id="ttl-hero">
                Simplifique seus <span>Agendamentos</span>
              </h1>
              <p>
                Conecte clientes e prestadores de serviço de forma rápida, fácil e segura.
                O futuro dos agendamentos está aqui.
              </p>
              <div className="hero-ctas">
                <a href="#sobre" className="btn ghost">Saiba Mais</a>
              </div>
            </div>

            <aside className="hero-card" aria-label="Próximo agendamento">
              <div className="hc-head">

                <img src={LogoAgendei} alt="Logo agendei" width="50px" />
                <div>
                  <strong>Próximo Agendamento</strong>
                  <small> Hoje, 14:30</small>
                </div>
              </div>

              <div className="hc-box">
                <div className="hc-title">
                  <strong>Corte + Barba</strong>
                  <small>Barbearia do João</small>
                </div>
                <div className="hc-foot">
                  <span className="price">R$ 40,00</span>
                  <small>45 min</small>
                </div>
              </div>
            </aside>
          </div>
          <span className="bg-orb orb-1" aria-hidden="true"></span>
          <span className="bg-orb orb-2" aria-hidden="true"></span>
        </section>


        <section id="sobre" className="about" aria-labelledby="ttl-sobre">
          <div className="container">
            <header className="section-head">
              <h2 id="ttl-sobre">Nossa História</h2>
              <p>Nascemos da necessidade de simplificar a vida de quem oferece e de quem busca serviços</p>
            </header>

            <div className="cards-2">
              <article className="card-info">
                <div className="icon soft-purple" aria-hidden="true">💡</div>
                <div>
                  <h3>A Ideia</h3>
                  <p>
                    Em 2023, percebemos que tanto clientes quanto prestadores de serviço enfrentavam dificuldades
                    para se conectar de forma eficiente: ligações perdidas, horários desencontrados e falta de
                    organização eram problemas constantes.
                  </p>
                </div>
              </article>

              <article className="card-info">
                <div className="icon soft-orange" aria-hidden="true">⚡</div>
                <div>
                  <h3>A Solução</h3>
                  <p>
                    Criamos uma plataforma que conecta pessoas de forma inteligente, permitindo agendamentos rápidos,
                    gestão eficiente de horários e uma experiência simples e moderna. Hoje, milhares confiam no Agendei.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>


        <section id="cliente" className="features" aria-labelledby="ttl-cliente">
          <div className="container">
            <header className="section-head">
              <h2 id="ttl-beneficios">Por que devo ser cliente no Agendei</h2>
              <p>Descubra como o Agendei facilita sua vida ao conectar você aos melhores profissionais de estética e beleza da sua região.</p>
            </header>

            <div className="cards-3">
              <article className="feature">
                <div className="icon soft-purple" aria-hidden="true">⏱️</div>
                <h3>Agendamento Fácil e Rápido</h3>
                <p>Escolha o serviço, veja horários disponíveis em tempo real e confirme o agendamento em poucos cliques.</p>
              </article>

              <article className="feature">
                <div className="icon soft-orange" aria-hidden="true">📍</div>
                <h3>Busque por Localização</h3>
                <p>Encontre profissionais e estabelecimentos próximos. Visualize o endereço no mapa e calcule o tempo de deslocamento.</p>
              </article>

              <article className="feature">
                <div className="icon soft-green" aria-hidden="true">🔔</div>
                <h3>Avaliações e Experiências</h3>
                <p>Veja avaliações de outros clientes e escolha prestadores de confiança com base na reputação e qualidade do serviço.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="prestador" className="features" aria-labelledby="ttl-prestador">
          <div className="container">
            <header className="section-head">
              <h2 id="ttl-prestador">Por que anunciar seu negócio no Agendei?</h2>
              <p>Transforme sua forma de atender e conquiste mais clientes com uma plataforma moderna e eficiente.</p>
            </header>

            <div className="cards-3">
              <article className="feature">
                <div className="icon soft-purple" aria-hidden="true">💼</div>
                <h3>Gestão de Serviços e Agenda</h3>
                <p>Controle seus agendamentos, bloqueie horários e visualize sua disponibilidade de forma simples e automatizada.</p>
              </article>

              <article className="feature">
                <div className="icon soft-orange" aria-hidden="true">👥</div>
                <h3>Equipe Colaborativa</h3>
                <p>Convide outros prestadores para o seu negócio. Cada profissional pode gerenciar seus próprios horários e serviços.</p>
              </article>

              <article className="feature">
                <div className="icon soft-green" aria-hidden="true">📊</div>
                <h3>Relatórios e Desempenho</h3>
                <p>Acompanhe seus resultados com relatórios de serviços e agendamentos. Entenda o que está funcionando e otimize seu atendimento.</p>
              </article>
            </div>
          </div>
        </section>


        <section id="entrar" className="anchor-dummy" aria-hidden="true"></section>
        <section id="cadastrar" className="anchor-dummy" aria-hidden="true"></section>
      </main>

      <footer className="site-footer dark">
        <div className="container footer-grid">
          <div className="col brand-col">
            <div className="footer-brand">

              <img src={LogoAgendeiVet} alt="Logo agendei" width="100px" />
            </div>
            <p className="foot-desc">
              Conectando pessoas e simplificando agendamentos em todo o Brasil.
            </p>


          </div>

          <nav className="col links-col" aria-label="Links Rápidos">
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#sobre">Sobre Nós</a></li>

            </ul>
          </nav>

          <nav className="col support-col" aria-label="Suporte">
            <h4>Suporte</h4>
            <ul>

              <li><a href="/politica_privacidade/index.html">Termos de Uso e Políticas de Privacidade</a></li>

            </ul>
          </nav>

        </div>

        <div className="container foot-bottom">
          <small>© 2025 Agendei. Todos os direitos reservados. Feito com <span className="heart">❤</span> no Brasil.</small>
        </div>
      </footer>
    </>
  )
}

export default Home;