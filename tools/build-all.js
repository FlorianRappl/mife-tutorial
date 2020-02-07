const { existsSync, readdirSync, rmdirSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const { execSync } = require("child_process");

const root = resolve(__dirname, "..");
const packages = resolve(root, "packages");
const dist = resolve(root, "dist");
const manifest = resolve(dist, "static", "microfrontends.json");
const names = readdirSync(packages);
const urls = names.filter(n => n.startsWith("mife-")).map(n => `./${n}.js`);

if (existsSync(dist)) {
  rmdirSync(dist, { recursive: true });
}

names.forEach(name => {
  const cwd = resolve(packages, name);
  execSync("npm run build", { cwd });
});

writeFileSync(manifest, JSON.stringify(urls), "utf8");
