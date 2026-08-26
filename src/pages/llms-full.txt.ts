import type { APIRoute } from "astro";
import { compareSlugs, slugFromPath } from "../lib/docs";

export const GET: APIRoute = async () => {
  const docModules = import.meta.glob("/docs/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const sortedFiles = Object.entries(docModules).sort(([pathA], [pathB]) =>
    compareSlugs(slugFromPath(pathA), slugFromPath(pathB))
  );

  const sections = sortedFiles.map(([filepath, rawContent]) => {
    const filename = `${slugFromPath(filepath)}.md`;
    const content = typeof rawContent === "string" ? rawContent.trim() : "";
    const separator = "=".repeat(80);
    return `${separator}\nFILE: ${filename}\nURL: https://podomy.com/docs/${filename}\n${separator}\n\n${content}`;
  });

  const header = `# Podomy / Concord Complete Documentation Context
# Generated for LLMs, AI agents, Cursor/Copilot, and context windows
# Repository: https://github.com/podomy/concord
# Website: https://podomy.com
# Manifest: https://podomy.com/llms.txt
# Exported: ${new Date().toISOString()}

`;

  const body = header + sections.join("\n\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
