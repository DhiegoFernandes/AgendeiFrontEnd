export default async function handler(req, res) {
  // URL do backend HTTP
  const backendURL = "http://152.67.42.48:8080" + req.url;

  try {
    // Prepara os headers, removendo o 'host' para evitar conflito
    const headers = {};
    
    // Copia headers relevantes, excluindo os que podem causar problemas
    Object.keys(req.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'host' && 
          lowerKey !== 'content-length' &&
          lowerKey !== 'connection') {
        headers[key] = req.headers[key];
      }
    });

    // Prepara o body se necessário
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Faz a requisição para o backend
    const response = await fetch(backendURL, {
      method: req.method,
      headers: headers,
      body: body,
    });

    // Lê a resposta
    const data = await response.text();
    
    // Retorna a resposta com o status code original
    res.status(response.status);
    
    // Copia os headers relevantes da resposta
    response.headers.forEach((value, key) => {
      // Evita copiar headers que podem causar problemas
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'content-encoding' && 
          lowerKey !== 'transfer-encoding' &&
          lowerKey !== 'connection') {
        res.setHeader(key, value);
      }
    });
    
    res.send(data);
  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).json({ error: "Erro ao conectar com o backend", details: error.message });
  }
}

