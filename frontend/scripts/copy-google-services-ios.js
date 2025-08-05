import { fs } from 'fs';
import { path, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const base64 = process.env.GOOGLE_SERVICE_INFO_PLIST_B64;
if (!base64) {
  console.error('Missing GOOGLE_SERVICE_INFO_PLIST_B64 environment variable.');
  process.exit(1);
}

const filePath = path.resolve(__dirname, '..', 'ios', 'repple', 'GoogleService-Info.plist');
fs.writeFileSync(filePath, Buffer.from(base64, 'base64').toString('utf-8'));
console.log('Successfully wrote GoogleService-Info.plist');
