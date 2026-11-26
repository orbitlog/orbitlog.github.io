import { access, copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const apps = [
  { slug: 'relaverse', build: process.argv[2] },
  { slug: 'pushsheet-studio', build: process.argv[3], requiredFile: 'templates/push-default.xlsx' },
];

// Validate all inputs before modifying the deployment directory.
await access(resolve(output, 'index.html'));
const appBuilds = await Promise.all(apps.map(async ({ slug, build, requiredFile }) => {
  const source = resolve(root, build ?? `.projects/${slug}/dist`);
  const html = await readFile(resolve(source, 'index.html'), 'utf8');
  if (!html.includes(`/${slug}/assets/`)) {
    throw new Error(`Build ${slug} with: npm run build -- --base=/${slug}/`);
  }
  if (requiredFile) await access(resolve(source, requiredFile));
  return { source, destination: resolve(output, slug) };
}));

for (const { source, destination } of appBuilds) {
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
}

// GitHub Pages serves these directory indexes on direct visits and refreshes.
const planets = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const routes = ['blog', 'about', ...planets.map((planet) => `module/${planet}`)];
const posts = await readdir(resolve(root, 'src/content/blog'));
routes.push(...posts.filter((name) => name.endsWith('.md')).map((name) => `module/mercury/${name.slice(0, -3)}`));
const interests = await readdir(resolve(root, 'src/content/interests'));
routes.push(...interests.filter((name) => name.endsWith('.md')).map((name) => `module/jupiter/${name.slice(0, -3)}`));
for (const route of routes) {
  const destination = resolve(output, route);
  await mkdir(destination, { recursive: true });
  await copyFile(resolve(output, 'index.html'), resolve(destination, 'index.html'));
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Prepared GitHub Pages: blog routes + ${apps.map(({ slug }) => `/${slug}/`).join(' + ')}`);
