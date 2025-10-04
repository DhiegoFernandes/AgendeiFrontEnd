import { useState } from "react";
import { BtnVoltar } from "../../components/btn-voltar";
import { useApi } from "../../hooks/useApi";
import type { User } from "../../types/user";

function Cadastro() {
    const api = useApi();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("CLIENTE");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const dataToSend:User = {
                nome,
                email,  
                telefone,
                senha,
                perfil,
                cep,
                endereco
            }

            const response = await api?.post("/usuarios/registrar", dataToSend)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

  return(
    <>
      <form onSubmit={handleRegister}>
          <input 
          type="text"
          placeholder="nome"
          className="name"
          value={nome}
          onChange={e => setNome(e.target.value)}
          />
          <input 
              type="email"
              placeholder="email"
              className="name"
              value={email}
              onChange={e => setEmail(e.target.value)}
          />
          <input 
              type="text"
              placeholder="numero"
              className="name"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
          />
          <input 
              type="password"
              placeholder="senha"
              className="name"
              value={senha}
              onChange={e => setSenha(e.target.value)}
          />
          <select className="perfil" onChange={e => setPerfil(e.target.value)}>
              <option value="CLIENTE">CLIENTE</option>
              <option value="PRESTADOR">PRESTADOR</option>
          </select>
            {perfil === "CLIENTE" && (
            <>
                <input 
                type="text"
                placeholder="CEP"
                className="name"
                value={cep}
                onChange={e => setCep(e.target.value)}
                />
                <input 
                type="text"
                placeholder="Endereço"
                className="name"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                />
            </>
            )}
          <button type="submit">Cadastrar</button> 
      </form>
      <BtnVoltar />
    </>       
  )
}

export default Cadastro;