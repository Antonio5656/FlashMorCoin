const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  // Servir HTML básico
  if (req.url === '/' || req.url === '/index.html') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>FlashMorCoin Test</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0; 
                padding: 50px; 
                color: white;
                text-align: center;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 FlashMorCoin - TEST SERVER</h1>
            <p>Esta es una página HTML estática. Si la ves, el servidor funciona.</p>
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2>Próximos pasos:</h2>
                <p>1. Next.js está instalado correctamente</p>
                <p>2. El puerto 3000 está accesible</p>
                <p>3. El problema está en la configuración de React/Next.js</p>
            </div>
            <button onclick="alert('JavaScript funciona!')" 
                    style="padding: 10px 20px; background: white; color: #667eea; border: none; border-radius: 5px; cursor: pointer;">
                Probar JavaScript
            </button>
        </div>
    </body>
    </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Para cualquier otra ruta
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Página no encontrada');
});

server.listen(port, () => {
  console.log(`🚀 Servidor de prueba ejecutándose en http://localhost:${port}`);
  console.log(`📁 Directorio actual: ${process.cwd()}`);
});