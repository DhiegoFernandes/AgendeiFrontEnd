import { useNavigate } from "react-router-dom"

export function BtnVoltar() {
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate('/')}>
            Menu
        </button>
    )
}   