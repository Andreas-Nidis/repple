import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const base64 = process.env.GOOGLE_SERVICES_JSON_B64;
if (!base64) {
  console.error('Missing GOOGLE_SERVICES_JSON_B64 environment variable.');
  process.exit(1);
}

const filePath = resolve(__dirname, '..', 'android', 'app', 'google-services.json');
writeFileSync(filePath, Buffer.from(base64, 'base64').toString('utf-8'));
console.log('Successfully wrote google-services.json');
