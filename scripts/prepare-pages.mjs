import { access, copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const relaverseOutput = resolve(root, process.argv[2] ?? '.projects/relaverse/dist');

// Fail before publishing if either application has not been built.
await access(resolve(output, 'index.html'));
await access(resolve(relaverseOutput, 'index.html'));
const relaverseHtml = await readFile(resolve(relaverseOutput, 'index.html'), 'utf8');
if (!relaverseHtml.includes('/relaverse/assets/')) {
  throw new Error('Build Relaverse with: npm run build -- --base=/relaverse/');
}

await rm(resolve(output, 'relaverse'), { recursive: true, force: true });
await cp(relaverseOutput, resolve(output, 'relaverse'), { recursive: true });

// GitHub Pages serves these directory indexes on direct visits and refreshes.
const planets = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const routes = ['blog', 'about', ...planets.map((planet) => `module/${planet}`)];
for (const route of routes) {
  const destination = resolve(output, route);
  await mkdir(destination, { recursive: true });
  await copyFile(resolve(output, 'index.html'), resolve(destination, 'index.html'));
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Prepared GitHub Pages: blog routes + /relaverse/');
