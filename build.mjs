// 빌드: src/* → 저장소 루트 index.html (단일 파일, 외부 의존성 없음)
import fs from 'fs';
const r = f => fs.readFileSync(f, 'utf8');
const js = ['src/engine.js', 'src/data/lovers.js', 'src/data/events.js', 'src/data/endings.js', 'src/ui.js'].map(r).join('\n');
const html = r('src/shell.html').replace('/*CSS*/', () => r('src/style.css')).replace('/*JS*/', () => js);
fs.writeFileSync('index.html', html);
console.log('index.html', (html.length / 1024).toFixed(0) + 'KB');
