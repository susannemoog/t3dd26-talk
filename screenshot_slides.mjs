import { execSync, spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = join(__dir, 'assets/screenshots');
const SLIDE_COUNT = 15;
const PORT = 13729;

mkdirSync(OUT, { recursive: true });

// Start serve
const server = spawn('npx', ['serve', '-p', PORT, '-s', __dir], {
  stdio: 'ignore', detached: true
});
server.unref();
await new Promise(r => setTimeout(r, 1800));

console.log(`Screenshotting ${SLIDE_COUNT} slides...`);

for (let i = 0; i < SLIDE_COUNT; i++) {
  const url = `http://localhost:${PORT}/#/${i}`;
  const out = join(OUT, `slide-${String(i).padStart(2,'0')}.png`);
  try {
    execSync(
      `"${CHROME}" --headless=new --disable-gpu --window-size=1280,720 \
        --screenshot="${out}" "${url}"`,
      { timeout: 8000, stdio: 'pipe' }
    );
    console.log(`  ✓ slide ${i+1}/${SLIDE_COUNT}`);
  } catch (e) {
    console.error(`  ✗ slide ${i+1}: ${e.message.slice(0,80)}`);
  }
  await new Promise(r => setTimeout(r, 400));
}

// Stop server
try { process.kill(-server.pid); } catch {}
console.log(`Done → ${OUT}`);
