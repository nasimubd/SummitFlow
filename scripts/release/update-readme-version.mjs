import { readFile, writeFile } from "node:fs/promises";

const version = process.argv[2];

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version ?? "")) {
  throw new Error("Expected a semantic version argument.");
}

const readme = await readFile("README.md", "utf8");
const versionBadge = /https:\/\/img\.shields\.io\/badge\/version-[^-?]+-[^?]+\.svg\?logo=git&logoColor=white/;

if (!versionBadge.test(readme)) {
  throw new Error("README version badge was not found.");
}

const updated = readme.replace(
  versionBadge,
  `https://img.shields.io/badge/version-${version}-blue.svg?logo=git&logoColor=white`,
);

await writeFile("README.md", updated);
