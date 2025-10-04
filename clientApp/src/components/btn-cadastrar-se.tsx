import { useNavigate } from "react-router-dom"

export function BtnCadastrar() {
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate('/cadastro')}>
            Cadastrar-se
        </button>
    )
}