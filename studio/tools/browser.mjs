// Shared Chromium launcher: uses $CHROME, the cloud sandbox's bundled Chromium, or Playwright's default.
// Chromium keeps its shared memory in /dev/shm (tmpfs), not as hidden files in /tmp: Playwright's default --disable-dev-shm-usage filled the session's disk allowance during long renders (ep. 4, ENOSPC).
import { chromium } from 'playwright'; import fs from 'fs';
const CANDIDATES = [process.env.CHROME, '/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(Boolean);
export async function launch() { const exe = CANDIDATES.find(p => fs.existsSync(p)); return chromium.launch({ ...(exe ? { executablePath: exe } : {}), ignoreDefaultArgs: ['--disable-dev-shm-usage'], args: ['--allow-file-access-from-files', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); }
