import type { APIRoute } from "astro";
import { compareSlugs, slugFromPath } from "../lib/docs";

// One bundle section per doc, prefixed with its file name and canonical URL.
function sectionsFor(docModules: Record<string, unknown>, base: string): string[] {
  const sortedFiles = Object.entries(docModules).sort(([pathA], [pathB]) =>
    compareSlugs(slugFromPath(pathA), slugFromPath(pathB))
  );

  return sortedFiles.map(([filepath, rawContent]) => {
    const filename = `${slugFromPath(filepath)}.md`;
    const content = typeof rawContent === "string" ? rawContent.trim() : "";
    const separator = "=".repeat(80);
    return `${separator}\nFILE: ${filename}\nURL: ${base}/${filename}\n${separator}\n\n${content}`;
  });
}

export const GET: APIRoute = async () => {
  const concordModules = import.meta.glob("/docs/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });
  const flintModules = import.meta.glob("/docs-flint/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const sections = [
    ...sectionsFor(concordModules, "https://podomy.com/docs"),
    ...sectionsFor(flintModules, "https://podomy.com/flint/docs"),
  ];

  const header = `# Podomy / Concord / Flint Complete Documentation Context
# Generated for LLMs, AI agents, Cursor/Copilot, and context windows
# Repository: https://github.com/podomy/concord
# Repository: https://github.com/podomy/flint
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
