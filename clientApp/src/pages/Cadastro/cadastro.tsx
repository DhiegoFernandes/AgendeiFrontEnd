import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cadastro-style.module.css";
import LogoAgendeiHori from "../../assets/AgendeiHorizontal.png";

export function Cadastro() {
  const [tipoConta, setTipoConta] = useState<"cliente" | "prestador">("cliente");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [termos, setTermos] = useState(false);

  const refEndereco = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Só números no celular
  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTelefone(e.target.value.replace(/\D/g, ""));
  }

  // Máscara CEP
  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(v.slice(0, 9));
  }

  // Busca API ViaCEP ao sair do campo
  async function buscarCep() {
    const numerico = cep.replace(/\D/g, "");
    if (numerico.length !== 8) {
      setEndereco("");
      alert("CEP inválido!");
      return;
    }
    setEndereco("Buscando...");
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${numerico}/json/`);
      const data = await resp.json();
      if (data.erro) {
        setEndereco("");
        alert("CEP não encontrado!");
      } else {
        setEndereco(data.logradouro || "");
        setTimeout(() => refEndereco.current?.focus(), 100);
      }
    } catch (error) {
      setEndereco("");
      alert("Erro ao buscar CEP");
    }
  }

  function toggleShowSenha() {
    setShowSenha((s) => !s);
  }
  function toggleShowConfirmSenha() {
    setShowConfirmSenha((s) => !s);
  }

  function handleTipoContaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as "cliente" | "prestador";
    setTipoConta(value);
    if (value === "prestador") {
      setCep("");
      setEndereco("");
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Adapte para integração sua API ou validação aqui!
    console.log({
      tipoConta,
      nome,
      email,
      telefone,
      cep: tipoConta === "cliente" ? cep : "",
      endereco: tipoConta === "cliente" ? endereco : "",
      senha,
      confirmSenha,
      termos,
    });
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={LogoAgendeiHori} alt="Agendei" />
        </div>
        <nav>
          <a href="#" onClick={e => {e.preventDefault(); navigate("/login")}}>
            Já tem conta? <span className={styles.loginLink}>Fazer login</span>
          </a>
        </nav>
      </header>
      <main className={styles.container}>
        <section className={styles.formSection}>
          <h2>Criar Conta</h2>
          
          <form autoComplete="off" onSubmit={onSubmit}>

            <div className={styles.formGroup}>
              <label htmlFor="tipoConta">Tipo de conta <span className={styles.vermelho}>*</span></label>
              <select
                id="tipoConta"
                required
                value={tipoConta}
                onChange={handleTipoContaChange}
              >
                <option value="cliente">Cliente</option>
                <option value="prestador">Prestador</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="full-name">
                Nome Completo <span className={styles.vermelho}>*</span>
              </label>
              <input
                type="text"
                id="full-name"
                placeholder="Digite seu nome completo"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                E-mail <span className={styles.vermelho}>*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                Celular <span className={styles.vermelho}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="(11) 999999999"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={11}
              />
            </div>

            {/* Só para cliente */}
            {tipoConta === "cliente" && (
              <>
                <div className={`${styles.formGroup} ${styles.somenteCliente}`}>
                  <label htmlFor="cep">
                    CEP <span className={styles.vermelho}>*</span>
                  </label>
                  <div className={styles.cepContainer}>
                    <input
                      type="text"
                      id="cep"
                      placeholder="00000-000"
                      required={tipoConta === "cliente"}
                      value={cep}
                      onChange={handleCepChange}
                      onBlur={() => {
                        if (cep.replace(/\D/g, "").length === 8) buscarCep();
                      }}
                      maxLength={9}
                    />
                  </div>
                </div>
                <div className={`${styles.formGroup} ${styles.somenteCliente}`}>
                  <label htmlFor="street">
                    Endereço completo <span className={styles.vermelho}>*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    placeholder="Ex: Rua 25 de março Nº 352"
                    required={tipoConta === "cliente"}
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)}
                    ref={refEndereco}
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="password">
                Senha <span className={styles.vermelho}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSenha ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  required
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={styles.togglePassword}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={toggleShowSenha}
                  aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenha ? (
                    <svg className={styles.eyeIcon} width="22" height="22" fill="none" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#7c4eff" strokeWidth={2}/>
                      <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                      <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                    </svg>
                  ) : (
                    <svg className={styles.eyeIcon} width="22" height="22" fill="none" viewBox="0 0 20 20">
                      <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                      <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm-password">
                Confirma a senha <span className={styles.vermelho}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmSenha ? "text" : "password"}
                  id="confirm-password"
                  placeholder="********"
                  required
                  value={confirmSenha}
                  onChange={e => setConfirmSenha(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={styles.togglePassword}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={toggleShowConfirmSenha}
                  aria-label={showConfirmSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmSenha ? (
                    <svg className={styles.eyeIcon} width="22" height="22" fill="none" viewBox="0 0 20 20">
                      <path d="M2 2l16 16" stroke="#7c4eff" strokeWidth={2}/>
                      <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                      <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                    </svg>
                  ) : (
                    <svg className={styles.eyeIcon} width="22" height="22" fill="none" viewBox="0 0 20 20">
                      <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z" stroke="#7c4eff" strokeWidth={2}/>
                      <circle cx="10" cy="10" r="3" stroke="#7c4eff" strokeWidth={2}/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* CHECKBOX ALINHADO */}
            <div className={`${styles.formGroup} ${styles.checkbox}`}>
              <input
                type="checkbox"
                id="terms"
                required
                checked={termos}
                onChange={e => setTermos(e.target.checked)}
              />
              <label htmlFor="terms">
                Eu concordo com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>
              </label>
            </div>

            {/* BOTÕES AFASTADOS */}
            <div className={styles.formActions}>
              <button
                type="reset"
                className={styles.btnMudar}
                onClick={() => {
                  setTipoConta("cliente");
                  setNome("");
                  setEmail("");
                  setTelefone("");
                  setCep("");
                  setEndereco("");
                  setSenha("");
                  setConfirmSenha("");
                  setShowSenha(false);
                  setShowConfirmSenha(false);
                  setTermos(false);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className={`${styles.btn} ${styles.primary}`}>
                Criar Conta
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default Cadastro;