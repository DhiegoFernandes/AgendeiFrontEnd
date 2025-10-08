import { useState } from "react";

function InicioCliente() {
    const [nome, setNome] = useState(
        localStorage.getItem("nome")
    )

    const [token, setToken] = useState(
        localStorage.getItem("token")
    ) 

    const [perfil, setPerfil] = useState(
        localStorage.getItem("perfil")
    ) 

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-700">
            <h1 className="text-8xl text-blue-600">
                Hello, {nome}!
            </h1>
        </div>      
    )
}

export default InicioCliente; 