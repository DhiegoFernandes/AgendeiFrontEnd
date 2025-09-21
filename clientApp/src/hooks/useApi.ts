import { useContext } from "react";
import { ApiContext } from "../context/apiContext";

export const useApi = () => {
    const context = useContext(ApiContext)

    if (!context) {
        throw new Error("useApi deve ser usado dentro de ApiProvider")
    }

    return context
}