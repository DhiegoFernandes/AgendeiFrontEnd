import { useContext } from "react";
import { ApiContext } from "../context/apiContext";

export const useApi = () => {
    const context = useContext(ApiContext)

    return context
}