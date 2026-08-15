import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, cpSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const DOCS_DIR = resolve(ROOT_DIR, "docs");

const GITHUB_REPO = "podomy/concord";
const GITHUB_BRANCH = "main";
const GITHUB_DOCS_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/docs?ref=${GITHUB_BRANCH}`;
const LOCAL_CONCORD_DOCS = resolve(ROOT_DIR, "../concord/docs");

async function fetchFromGitHub() {
  const headers = {
    "User-Agent": "Podomy-Docs-Sync",
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  console.log(`[docs:sync] Fetching docs list from GitHub (${GITHUB_REPO})...`);
  const res = await fetch(GITHUB_DOCS_API, { headers });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${res.statusText}`);
  }

  const items = await res.json();
  if (!Array.isArray(items)) {
    throw new Error("Invalid response format from GitHub API");
  }

  const mdFiles = items.filter(
    (item) => item.type === "file" && item.name.endsWith(".md")
  );

  if (mdFiles.length === 0) {
    throw new Error("No .md files found in remote docs directory");
  }

  mkdirSync(DOCS_DIR, { recursive: true });

  const fetchedFiles = new Set();

  for (const file of mdFiles) {
    console.log(`[docs:sync] Downloading ${file.name}...`);
    const fileRes = await fetch(file.download_url, { headers });
    if (!fileRes.ok) {
      throw new Error(`Failed to download ${file.name}: ${fileRes.statusText}`);
    }
    const content = await fileRes.text();
    const destPath = join(DOCS_DIR, file.name);
    writeFileSync(destPath, content, "utf-8");
    fetchedFiles.add(file.name);
  }

  // Remove any stale local docs not in remote
  if (existsSync(DOCS_DIR)) {
    const existing = readdirSync(DOCS_DIR);
    for (const f of existing) {
      if (f.endsWith(".md") && !fetchedFiles.has(f)) {
        console.log(`[docs:sync] Removing stale file ${f}...`);
        rmSync(join(DOCS_DIR, f));
      }
    }
  }

  console.log(`[docs:sync] Successfully synced ${fetchedFiles.size} docs from GitHub.`);
}

function syncFromLocalFallback() {
  if (existsSync(LOCAL_CONCORD_DOCS)) {
    console.log(`[docs:sync] Falling back to local concord directory (${LOCAL_CONCORD_DOCS})...`);
    mkdirSync(DOCS_DIR, { recursive: true });
    cpSync(LOCAL_CONCORD_DOCS, DOCS_DIR, { recursive: true });
    console.log(`[docs:sync] Synced docs from local concord repository.`);
    return true;
  }
  return false;
}

async function main() {
  try {
    await fetchFromGitHub();
  } catch (err) {
    console.warn(`[docs:sync] Remote fetch warning: ${err.message}`);
    if (syncFromLocalFallback()) {
      return;
    }
    if (existsSync(DOCS_DIR) && readdirSync(DOCS_DIR).some((f) => f.endsWith(".md"))) {
      console.warn("[docs:sync] Using existing cached docs in docs/ directory.");
      return;
    }
    console.error("[docs:sync] Error: Unable to fetch or locate concord docs.");
    process.exit(1);
  }
}

main();
