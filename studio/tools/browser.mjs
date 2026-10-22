// Shared Chromium launcher: uses $CHROME, the cloud sandbox's bundled Chromium, or Playwright's default.
import { chromium } from 'playwright'; import fs from 'fs';
const CANDIDATES = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(Boolean);
export async function launch() { const exe = CANDIDATES.find(p => fs.existsSync(p)); return chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--allow-file-access-from-files', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); }
