import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the emoji data from the emoji-datasource package
const emojiDataPath = path.join(__dirname, '../node_modules/emoji-datasource/emoji_pretty.json');
const pretty = JSON.parse(fs.readFileSync(emojiDataPath, 'utf8'));

const dataDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(
  path.join(dataDir, 'emoji-data.json'),
  JSON.stringify(pretty)
);

console.log('Emoji data prepared successfully!');
