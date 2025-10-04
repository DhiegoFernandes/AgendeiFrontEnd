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


        <section className="features" aria-labelledby="ttl-beneficios">
          <div className="container">
            <header className="section-head">
              <h2 id="ttl-beneficios">Por que usar o Agendei?</h2>
              <p>Descubra como nossa plataforma pode transformar a forma como você agenda e oferece serviços</p>
            </header>

            <div className="cards-3">
              <article className="feature">
                <div className="icon soft-purple" aria-hidden="true">⏱️</div>
                <h3>Agendamento Rápido</h3>
                <p>Agende seus serviços em poucos cliques. Veja horários disponíveis em tempo real e confirme instantaneamente.</p>
              </article>

              <article className="feature">
                <div className="icon soft-orange" aria-hidden="true">📍</div>
                <h3>Localização Inteligente</h3>
                <p>Encontre prestadores próximos a você. Nossa tecnologia mostra distância e tempo de deslocamento.</p>
              </article>

              <article className="feature">
                <div className="icon soft-green" aria-hidden="true">🔔</div>
                <h3>Notificação</h3>
                <p>Receba lembretes automáticos sobre seus agendamentos. Nunca mais perca um compromisso.</p>
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