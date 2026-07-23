import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const samplesDir = path.join(__dirname, 'samples');

console.log('==============================================');
console.log('  📄 DANH SÁCH MẪU IN CÓ SẴN TRONG SAMPLES/   ');
console.log('==============================================');

if (fs.existsSync(samplesDir)) {
    const files = fs.readdirSync(samplesDir);
    if (files.length === 0) {
        console.log('⚠️ Chưa có file mẫu nào trong thư mục samples/.');
    } else {
        files.forEach((f, idx) => {
            const stats = fs.statSync(path.join(samplesDir, f));
            console.log(`${idx + 1}. ${f} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
    }
} else {
    console.log('❌ Thư mục samples/ chưa tồn tại!');
}
console.log('==============================================');
