/**
 * CORS Proxy Server & OnlyOffice Interceptor cho Web Order Santino
 * Forward: Localhost 8081 -> Backend (8081)
 */

const http = require('http');

const LISTEN_PORT = 8081;
const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 8081;

console.log('=======================================================');
console.log('       CORS PROXY - WEB ORDER SANTINO                 ');
console.log('=======================================================');

const server = http.createServer((req, res) => {
    // 1. Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');

    // 2. Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`[Proxy] ${req.method} ${req.url}`);

    // --- ONLYOFFICE CALLBACK INTERCEPTOR ---
    if (req.method === 'POST' && req.url.startsWith('/api/documents/callback')) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (data.status === 2 || data.status === 3) {
                    const downloadUri = data.url;
                    const docId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('docId');
                    console.log(`[ONLYOFFICE] Đã nhận sự kiện Lưu file cho DocID: ${docId}`);
                    console.log(`[ONLYOFFICE] Link tải file gốc mới nhất: ${downloadUri}`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ "error": 0 }));
            } catch (e) {
                console.error("[ONLYOFFICE Error]", e);
                res.writeHead(500);
                res.end("Lỗi Callback");
            }
        });
        return;
    }

    // 3. Forward request sang Backend
    const options = {
        hostname: BACKEND_HOST,
        port: BACKEND_PORT,
        path: req.url,
        method: req.method,
        headers: { ...req.headers }
    };

    delete options.headers['host'];
    delete options.headers['origin'];
    delete options.headers['referer'];

    const proxyReq = http.request(options, (proxyRes) => {
        const responseHeaders = { ...proxyRes.headers };
        responseHeaders['Access-Control-Allow-Origin'] = '*';
        
        res.writeHead(proxyRes.statusCode, responseHeaders);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`[Proxy Error] ${err.message}`);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: true, 
            message: `Lỗi Proxy: Không thể kết nối tới Backend tại ${BACKEND_HOST}:${BACKEND_PORT}.` 
        }));
    });

    req.pipe(proxyReq, { end: true });
});
