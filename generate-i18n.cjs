const fs = require('fs');
const path = require('path');

// Recursive function to get all files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

// Extract keys using regex
const files = walk('./src');
const keys = new Set();
const regex = /t\(['"]([^'"]+)['"]\)/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

console.log(`Found ${keys.size} keys in the codebase.`);

// Helper to set nested object properties
function setNested(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// Generate the dictionaries
const dictionaries = {
  fr: { translation: {} },
  en: { translation: {} },
  es: { translation: {} }
};

const keysArray = Array.from(keys).sort();

// Create default English and Spanish translations by making simple string transformations
function generateTranslation(key, lang) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  // Basic fallback based on the key name
  const humanized = lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  if (lang === 'fr') return `[FR] ${humanized}`;
  if (lang === 'en') return `[EN] ${humanized}`;
  if (lang === 'es') return `[ES] ${humanized}`;
  return humanized;
}

// We will keep existing translations if they exist by parsing the current i18n.ts (simplified approach: we will just overwrite it but try to keep existing ones if possible. Actually, it's safer to just read the current i18n.ts, but since it's a TS file with imports, we can't easily require it in a plain Node JS script without transpile. We will just generate the objects).
// Since we want to keep existing translations, let's extract them using a regex or eval.

let existingFr = {};
let existingEn = {};
let existingEs = {};

try {
  const i18nContent = fs.readFileSync('./src/i18n.ts', 'utf8');
  // Very hacky way to extract the resources object
  const resourcesMatch = i18nContent.match(/const resources = (\{[\s\S]*?\});\n\ni18n/);
  if (resourcesMatch) {
    const resourcesStr = resourcesMatch[1];
    // Need to safely evaluate it.
    const resources = new Function(`return ${resourcesStr}`)();
    existingFr = resources.fr.translation || {};
    existingEn = resources.en.translation || {};
    existingEs = resources.es.translation || {};
  }
} catch (e) {
  console.log("Could not parse existing i18n.ts, starting fresh.");
}

function getNested(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current === undefined) return undefined;
    current = current[parts[i]];
  }
  return current;
}

keysArray.forEach(key => {
  const existingFrValue = getNested(existingFr, key);
  const existingEnValue = getNested(existingEn, key);
  const existingEsValue = getNested(existingEs, key);

  setNested(dictionaries.fr.translation, key, existingFrValue || generateTranslation(key, 'fr'));
  setNested(dictionaries.en.translation, key, existingEnValue || generateTranslation(key, 'en'));
  setNested(dictionaries.es.translation, key, existingEsValue || generateTranslation(key, 'es'));
});

const newI18nContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fr, enUS, es } from 'date-fns/locale';

export const getDateLocale = () => {
  const lang = i18n.language || 'fr';
  if (lang.startsWith('en')) return enUS;
  if (lang.startsWith('es')) return es;
  return fr;
};

const resources = ${JSON.stringify(dictionaries, null, 2)};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
`;

fs.writeFileSync('./src/i18n.ts', newI18nContent);
console.log('Successfully updated src/i18n.ts with', keys.size, 'keys.');
