import api from "./api";

export async function validateToken() {  
  const token = localStorage.getItem("token");

  if (!token){
    return { isAuthenticated: false, loading: false };
  } 

  try {
    const response = await api.post("/auth/validate", { token });

    return { isAuthenticated: response.data.valid === true, loading: false };
  } catch {
    localStorage.removeItem("token");

    return { isAuthenticated: false, loading: false };
  }
}
