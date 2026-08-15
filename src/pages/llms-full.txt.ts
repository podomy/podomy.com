import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const docModules = import.meta.glob("/docs/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const preferredOrder = [
    "overview",
    "architecture",
    "cli",
    "sdk",
    "deployment",
  ];

  const sortedFiles = Object.entries(docModules).sort(([pathA], [pathB]) => {
    const slugA = pathA.split("/").pop()?.replace(".md", "") || "";
    const slugB = pathB.split("/").pop()?.replace(".md", "") || "";
    const idxA = preferredOrder.indexOf(slugA);
    const idxB = preferredOrder.indexOf(slugB);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return slugA.localeCompare(slugB);
  });

  const sections = sortedFiles.map(([filepath, rawContent]) => {
    const filename = filepath.split("/").pop() || "";
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
