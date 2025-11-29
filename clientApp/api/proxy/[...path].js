export default async function handler(req, res) {
  // O path vem como array do catch-all route [...path]
  const pathArray = req.query.path || [];
  const path = '/' + (Array.isArray(pathArray) ? pathArray.join('/') : pathArray);
  
  // URL completa do backend
  const backendURL = `http://152.67.42.48:8080${path}`;

  try {
    // Prepara os headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Copia headers importantes do request original
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    // Prepara o body se necessário
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    console.log(`[Proxy] ${req.method} ${backendURL}`);

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
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'content-encoding' && 
          lowerKey !== 'transfer-encoding' &&
          lowerKey !== 'connection' &&
          lowerKey !== 'content-length') {
        res.setHeader(key, value);
      }
    });
    
    res.send(data);
  } catch (error) {
    console.error("[Proxy] Erro:", error);
    res.status(500).json({ 
      error: "Erro ao conectar com o backend", 
      details: error.message,
      url: backendURL 
    });
  }
}

