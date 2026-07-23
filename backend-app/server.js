import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

// Setup directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SAMPLES_DIR = path.join(__dirname, 'samples');
const OUTPUT_DIR = path.join(__dirname, 'output');

[UPLOADS_DIR, SAMPLES_DIR, OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middleware
app.use(cors({ origin: '*' }));

app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}, express.static(UPLOADS_DIR));

app.use('/output', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}, express.static(OUTPUT_DIR));

app.use('/samples', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}, express.static(SAMPLES_DIR));

app.use(express.json({ limit: '50mb' }));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('[EXPRESS] Lỗi parse JSON payload!');
        return res.status(400).json({ success: false, message: 'Payload JSON không hợp lệ' });
    }
    next();
});

// ==========================================
// UTILITY FUNCTIONS (GENERIC & SAFE)
// ==========================================

/**
 * An toàn đường dẫn file (Chống tấn công Path Traversal)
 */
function sanitizeFileName(fileName) {
    if (!fileName) return 'file_' + Date.now();
    const base = path.basename(String(fileName).trim());
    return base.replace(/[\/\\:*?"<>|()+]/g, '_').replace(/\s+/g, '_');
}

/**
 * Tự động parse chuỗi JSON lồng nhau trong dữ liệu
 */
function deepParseJsonStrings(value) {
    if (typeof value === 'string') {
        const val = value.trim();
        if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
            try {
                return deepParseJsonStrings(JSON.parse(val));
            } catch (e) {
                return value;
            }
        }
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(item => deepParseJsonStrings(item));
    }
    if (value && typeof value === 'object' && value !== null) {
        const out = {};
        for (const key in value) {
            out[key] = deepParseJsonStrings(value[key]);
        }
        return out;
    }
    return value;
}

/**
 * Tìm file template trong thư mục samples an toàn
 */
function findTemplatePath(baseDir, templateName) {
    const cleanInput = String(templateName || '').replace(/\\/g, '/').replace(/^\/+/, '');
    const baseResolved = path.resolve(baseDir);
    const directPath = path.resolve(baseResolved, cleanInput);

    if (directPath.startsWith(baseResolved + path.sep)
        && fs.existsSync(directPath)
        && fs.statSync(directPath).isFile()
        && /\.docx$/i.test(directPath)) {
        return directPath;
    }

    const cleanName = cleanInput.replace(/\.docx?$/i, '');
    const findRecursive = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const found = findRecursive(fullPath);
                if (found) return found;
            } else if (entry.isFile()) {
                const entryBaseName = entry.name.replace(/\.docx?$/i, '');
                if (entryBaseName.normalize().toLowerCase() === cleanName.normalize().toLowerCase()) {
                    return fullPath;
                }
            }
        }
        return null;
    };
    return findRecursive(baseDir);
}

/**
 * Làm sạch Word XML tổng quát (Clean XML Split Tags & Auto-close Loop)
 */
function cleanWordXmlContent(xmlContent) {
    // 1. Xóa XML tags chèn lẫn vào giữa placeholder ngoặc nhọn { ... }
    let cleaned = xmlContent.replace(/\{[^{}]*?\}/g, (match) => {
        return match.replace(/<[^>]+>/g, "");
    });

    // 2. Tự động đóng các cặp tag {#loop} / {/loop} bị thiếu nếu có
    const openTags = [...cleaned.matchAll(/\{#([^}]+)\}/g)].map(m => m[1]);
    const closeTags = [...cleaned.matchAll(/\{\/([^}]+)\}/g)].map(m => m[1]);
    const openSet = new Set(openTags);
    const closeSet = new Set(closeTags);

    for (const tag of openSet) {
        if (!closeSet.has(tag)) {
            console.warn(`[XML-FIX] Loop chưa đóng: {#${tag}} -> Tự động thêm {/${tag}}`);
            const openMarker = `{#${tag}}`;
            const closeMarker = `{/${tag}}`;
            const idx = cleaned.indexOf(openMarker);
            if (idx >= 0) {
                const paraEnd = cleaned.indexOf('</w:p>', idx);
                if (paraEnd >= 0) {
                    const insertAt = paraEnd + '</w:p>'.length;
                    const closePara = `<w:p><w:r><w:t xml:space="preserve">${closeMarker}</w:t></w:r></w:p>`;
                    cleaned = cleaned.substring(0, insertAt) + closePara + cleaned.substring(insertAt);
                }
            }
        }
    }

    for (const tag of closeSet) {
        if (!openSet.has(tag)) {
            console.warn(`[XML-FIX] Loop chưa mở: {/${tag}} -> Tự động thêm {#${tag}}`);
            const closeMarker = `{/${tag}}`;
            const openMarker = `{#${tag}}`;
            const idx = cleaned.indexOf(closeMarker);
            if (idx >= 0) {
                const paraStart = cleaned.lastIndexOf('<w:p', idx);
                if (paraStart >= 0) {
                    const openPara = `<w:p><w:r><w:t xml:space="preserve">${openMarker}</w:t></w:r></w:p>`;
                    cleaned = cleaned.substring(0, paraStart) + openPara + cleaned.substring(paraStart);
                }
            }
        }
    }

    // 3. Tự động biến ( {Bien} ) thành {#Bien}({Bien}){/Bien} tổng quát cho BẤT KỲ biến nào trong ngoặc đơn
    // Giúp ẩn ngoặc đơn tự động nếu biến bị rỗng
    cleaned = cleaned.replace(/\(\s*\{([a-zA-Z0-9_]+)\}\s*\)/gi, '{#$1}({$1}){/$1}');

    return cleaned;
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Root API Info
app.get('/', (req, res) => {
    res.json({
        service: 'Generic Document Generation Engine',
        version: '2.0.0 (Stateless & Config-Free)',
        status: '✅ Running smoothly',
        endpoints: {
            listDocuments: 'GET /api/documents',
            listTemplates: 'GET /api/documents/templates',
            generateDocument: 'POST /api/documents/generate',
            deleteDocument: 'DELETE /api/documents/:fileName',
            uploadLogo: 'POST /api/upload-logo',
            callbackOnlyOffice: 'POST /api/documents/callback'
        }
    });
});

// 2. Danh sách file đã sinh ra trong uploads/
app.get('/api/documents', (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const files = fs.readdirSync(UPLOADS_DIR);
        const fileList = files
            .filter(file => file.endsWith('.docx') || file.endsWith('.pdf') || file.endsWith('.xlsx') || file.endsWith('.doc'))
            .map(file => {
                const stats = fs.statSync(path.join(UPLOADS_DIR, file));
                return {
                    fileName: file,
                    size: (stats.size / 1024).toFixed(2) + ' KB',
                    createdAt: stats.birthtime,
                    updatedAt: stats.mtime
                };
            });
        res.json({ success: true, data: fileList });
    } catch (error) {
        console.error('[API] Lỗi lấy danh sách tài liệu:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách file.' });
    }
});

// 3. Danh sách template có sẵn trong samples/ (Dùng cho Dropdown Select)
app.get('/api/documents/templates', (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        let results = [];
        const scanDir = (dir) => {
            if (!fs.existsSync(dir)) return;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    scanDir(fullPath);
                } else if (file.endsWith('.docx') || file.endsWith('.html')) {
                    const relPath = path.relative(SAMPLES_DIR, fullPath).replace(/\\/g, '/');
                    const cleanName = file.replace(/\.docx?$/i, '').replace(/_/g, ' ');
                    results.push({
                        id: relPath,
                        fileName: file,
                        displayName: cleanName,
                        relPath: relPath,
                        size: (stat.size / 1024).toFixed(2) + ' KB',
                        updatedAt: stat.mtime
                    });
                }
            }
        };
        scanDir(SAMPLES_DIR);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('[API] Lỗi lấy danh sách template:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách template.' });
    }
});

// 4. API Sinh tài liệu từ dữ liệu JSON Payload
app.post('/api/documents/generate', async (req, res) => {
    try {
        let { outputFileName, templateType, rowData } = req.body;

        if (!templateType) {
            return res.status(400).json({ success: false, message: 'Thiếu tên mẫu in (templateType).' });
        }
        if (!rowData || typeof rowData !== 'object') {
            return res.status(400).json({ success: false, message: 'Dữ liệu (rowData) truyền vào không hợp lệ.' });
        }

        const safeOutputName = sanitizeFileName(outputFileName || 'Generated_' + templateType.replace(/\.docx?$/i, ''));

        // Parse JSON lồng nhau trong rowData
        let dataMap = deepParseJsonStrings(rowData);

        // Gán STT ngầm vào nguồn dữ liệu (Data-level Only) cho mọi array
        const _injectSTT = (arr) => {
            if (!Array.isArray(arr) || arr.length === 0) return arr;
            return arr.map((item, idx) => {
                if (item && typeof item === 'object') {
                    const existingSTT = item.STT !== undefined && item.STT !== null && item.STT !== '' ? item.STT : null;
                    return { ...item, STT: existingSTT !== null ? existingSTT : (idx + 1) };
                }
                return item;
            });
        };

        for (const key of Object.keys(dataMap)) {
            if (Array.isArray(dataMap[key])) {
                if (dataMap[key].length === 0) {
                    dataMap[key] = [{}];
                }
                dataMap[key] = _injectSTT(dataMap[key]);
            }
        }


        // Tìm đường dẫn file template trong samples/
        let docxTemplatePath = findTemplatePath(SAMPLES_DIR, templateType);
        if (!docxTemplatePath) {
            // Fallback: Lấy file .docx đầu tiên có sẵn trong thư mục samples/
            const sampleFiles = fs.readdirSync(SAMPLES_DIR).filter(f => f.endsWith('.docx'));
            if (sampleFiles.length > 0) {
                docxTemplatePath = path.join(SAMPLES_DIR, sampleFiles[0]);
            }
        }

        if (!docxTemplatePath) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy template '${templateType}' hoặc bất kỳ file mẫu .docx nào trong thư mục samples/.`
            });
        }

        const content = fs.readFileSync(docxTemplatePath, "binary");
        const zip = new PizZip(content);

        // Chuẩn hóa đường dẫn tập tin trong ZIP
        try {
            const fileNames = Object.keys(zip.files);
            for (const name of fileNames) {
                if (name.includes('\\')) {
                    const normalizedName = name.replace(/\\/g, '/');
                    zip.files[normalizedName] = zip.files[name];
                    if (zip.files[normalizedName]) {
                        zip.files[normalizedName].name = normalizedName;
                    }
                    delete zip.files[name];
                }
            }
        } catch (normErr) {
            console.warn('[GENERATE] ⚠️ Lỗi chuẩn hóa đường dẫn ZIP:', normErr.message);
        }

        // Xử lý nắn Word XML tổng quát
        try {
            const docXmlFile = zip.file("word/document.xml");
            if (docXmlFile) {
                let xmlContent = docXmlFile.asText();
                xmlContent = cleanWordXmlContent(xmlContent);
                zip.file("word/document.xml", xmlContent);
            }
        } catch (cleanErr) {
            console.warn('[GENERATE] ⚠️ Lỗi làm sạch XML:', cleanErr.message);
        }

        // Khởi tạo Docxtemplater với parser thông minh (không phân biệt hoa/thường)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: function (tag) {
                return {
                    get: function (scope, context) {
                        if (tag === '.') return scope;
                        let val = undefined;

                        const scopeList = (context && context.scopeList) ? context.scopeList : [scope];
                        for (let i = scopeList.length - 1; i >= 0; i--) {
                            const currentScope = scopeList[i];
                            if (currentScope && typeof currentScope === 'object') {
                                if (currentScope[tag] !== undefined && currentScope[tag] !== null) {
                                    val = currentScope[tag];
                                    break;
                                } else {
                                    const cleanTag = tag.toLowerCase().replace(/_/g, '');
                                    const foundKey = Object.keys(currentScope).find(k => {
                                        const cleanKey = k.toLowerCase().replace(/_/g, '');
                                        return cleanKey === cleanTag;
                                    });
                                    if (foundKey && currentScope[foundKey] !== undefined && currentScope[foundKey] !== null) {
                                        val = currentScope[foundKey];
                                        break;
                                    }
                                }
                            }
                        }

                        if (val && typeof val === 'object') {
                            return val;
                        }
                        return val === null || val === undefined ? "" : String(val);
                    }
                };
            },
            nullGetter() {
                return "";
            }
        });

        // Render dữ liệu vào template
        try {
            doc.render(dataMap);
            console.log('[GENERATE] ✅ Render dữ liệu vào template thành công');

            // Xóa các ngoặc đơn dư thừa phát sinh sau render ( )
            const docZip = doc.getZip();
            if (docZip && docZip.file("word/document.xml")) {
                let xmlContent = docZip.file("word/document.xml").asText();
                xmlContent = xmlContent.replace(/\s*\(\s*\)/g, '');
                docZip.file("word/document.xml", xmlContent);
            }
        } catch (renderErr) {
            console.error('[GENERATE] ❌ Lỗi render Docxtemplater:', renderErr.message);
            if (renderErr.properties && renderErr.properties.errors) {
                console.error('[GENERATE] Chi tiết lỗi:', JSON.stringify(renderErr.properties.errors));
            }
            throw renderErr;
        }

        const docZip = doc.getZip();
        if (!docZip) {
            throw new Error('Không lấy được zip buffer sau khi render');
        }

        const buf = docZip.generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        const finalFileName = `${safeOutputName}_${Date.now()}.docx`;
        const outputPath = path.join(OUTPUT_DIR, finalFileName);
        const uploadsPath = path.join(UPLOADS_DIR, finalFileName);
        fs.writeFileSync(outputPath, buf);
        try { fs.writeFileSync(uploadsPath, buf); } catch (e) {}

        const protocol = req.protocol || 'http';
        const host = req.get('host') || `localhost:${PORT}`;
        const fileUrl = `${protocol}://${host}/output/${finalFileName}`;

        console.log(`[GENERATE] ✅ Đã tạo file: ${finalFileName}`);

        return res.json({
            success: true,
            message: 'Tạo tài liệu thành công!',
            fileName: finalFileName,
            fileUrl: fileUrl,
            data: {
                fileName: finalFileName,
                fileUrl: fileUrl
            }
        });

    } catch (error) {
        console.error('[API] Lỗi generate:', error);
        if (error.properties && error.properties.errors) {
            const details = error.properties.errors.map(e => e.message + (e.properties && e.properties.explanation ? ': ' + e.properties.explanation : '')).join('; ');
            return res.status(500).json({ success: false, message: 'Lỗi Docxtemplater: ' + details });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + (error.message || 'Unknown') });
    }
});

// 5. Xóa file đã tạo trong uploads/
app.delete('/api/documents/:fileName', (req, res) => {
    try {
        const safeName = sanitizeFileName(req.params.fileName);
        const filePath = path.join(UPLOADS_DIR, safeName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`[API] 🗑️ Đã xóa file: ${safeName}`);
            res.json({ success: true, message: 'Xóa file thành công!' });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy file để xóa!' });
        }
    } catch (error) {
        console.error('[API] Lỗi xóa file:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa file.' });
    }
});

// 6. Upload logo/hình ảnh
app.post('/api/upload-logo', (req, res) => {
    try {
        const { base64, fileName } = req.body;
        if (!base64) return res.status(400).json({ success: false, message: 'Thiếu dữ liệu base64' });

        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let imageBuffer = null;
        if (matches && matches.length === 3) {
            imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
            imageBuffer = Buffer.from(base64, 'base64');
        }

        const safeName = sanitizeFileName(fileName || 'logo.jpg');
        const logoDir = path.join(UPLOADS_DIR, 'logos');
        if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });

        const filePath = path.join(logoDir, safeName);
        fs.writeFileSync(filePath, imageBuffer);

        console.log(`[UPLOAD] Đã lưu logo tại: ${filePath}`);
        res.json({ success: true, message: 'Upload logo thành công!', fileName: safeName });
    } catch (error) {
        console.error('[API] Lỗi upload logo:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi upload logo.' });
    }
});

// 7. ONLYOFFICE Callback Handler
app.post('/api/documents/callback', async (req, res) => {
    const respondSuccess = () => res.json({ error: 0 });
    try {
        const data = req.body;
        const docId = req.query.docId || 'unknown';
        const fileName = req.query.fileName || `${docId}.docx`;
        const status = data.status;

        console.log(`[ONLYOFFICE] Callback — DocID: ${docId}, File: ${fileName}, Status: ${status}`);

        const isTemplate = req.query.isTemplate === '1';
        const targetDir = isTemplate ? SAMPLES_DIR : UPLOADS_DIR;

        if (status === 2 || status === 6) {
            const downloadUri = data.url;
            if (!downloadUri) return respondSuccess();

            console.log(`[ONLYOFFICE] Đang lưu file... (${status === 2 ? 'Save' : 'Forcesave'})`);
            const filePath = path.join(targetDir, sanitizeFileName(fileName));
            const response = await axios({ method: 'GET', url: downloadUri, responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });
            console.log(`[ONLYOFFICE] ✅ Đã lưu: ${fileName}`);
        }
        return respondSuccess();
    } catch (error) {
        console.error('[ONLYOFFICE] ❌ Lỗi Callback:', error.message);
        return respondSuccess();
    }
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log('=======================================================');
    console.log('       ✨ GENERIC DOCUMENT ENGINE - RUNNING           ');
    console.log('=======================================================');
    console.log(`[🚀] Server : http://localhost:${PORT}`);
    console.log(`[📁] Uploads: ${UPLOADS_DIR}`);
    console.log(`[📁] Samples: ${SAMPLES_DIR}`);
    console.log('=======================================================');
});
