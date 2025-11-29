module.exports = async (req, res) => {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extrai o path da query string ou da URL
  let path = req.query.path || '';
  
  // Se path vem como array, junta
  if (Array.isArray(path)) {
    path = path.join('/');
  }
  
  // Se não tem path na query, tenta extrair da URL
  if (!path && req.url && req.url !== '/api/proxy') {
    path = req.url.replace('/api/proxy', '').replace(/^\//, '');
  }
  
  // Se ainda não tem path, retorna erro
  if (!path) {
    return res.status(400).json({ error: 'Path não fornecido', url: req.url, query: req.query });
  }
  
  // Garante que o path comece com /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // URL completa do backend
  const backendURL = `http://152.67.42.48:8080${path}`;

  try {
    // Prepara os headers
    const headers = {};
    
    // Copia headers importantes do request original
    Object.keys(req.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== 'host' && 
          lowerKey !== 'content-length' &&
          lowerKey !== 'connection' &&
          lowerKey !== 'accept-encoding') {
        headers[key] = req.headers[key];
      }
    });

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
      url: backendURL,
      originalUrl: req.url,
      query: req.query
    });
  }
};

