import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the dist/data directory if it doesn't exist
const distDataDir = path.join(__dirname, '../dist/data');
if (!fs.existsSync(distDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
}

// Copy the emoji data file
const srcFile = path.join(__dirname, '../src/data/emoji-data.json');
const destFile = path.join(distDataDir, 'emoji-data.json');

if (fs.existsSync(srcFile)) {
  fs.copyFileSync(srcFile, destFile);
  console.log('Emoji data copied successfully!');
} else {
  console.error('Source emoji data file not found:', srcFile);
}
