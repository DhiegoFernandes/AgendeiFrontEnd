import { useState } from "react";
import { BtnCadastrar } from "../../components/btn-cadastrar-se";
import { BtnVoltar } from "../../components/btn-voltar";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import type { ResponseLogin } from "../../types/user";

function Login() {
    const api = useApi();
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const dataToLogin ={
                email,
                senha
            }

            const response: ResponseLogin = await api.post("/auth/login", dataToLogin)

            console.log(response)

            navigate(`/${response.perfil}`)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    type="sehha"
                    placeholder="senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)} 
                />
                <button type="submit">Sign In</button>
            </form>
            <BtnVoltar />
            <BtnCadastrar />
        </>       
    )
}

export default Login;