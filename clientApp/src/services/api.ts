import axios from "axios";

const api = axios.create({
    baseURL: "https://agendeiback-fgbgdbbpchcebgh0.eastus2-01.azurewebsites.net/",
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;