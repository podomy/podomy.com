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

  const docsEntries = sortedFiles.map(([filepath, rawContent]) => {
    const filename = slugFromPath(filepath);
    const content = typeof rawContent === "string" ? rawContent : "";
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const firstH1 = lines.find((l) => l.startsWith("# "))?.replace(/^#\s+/, "") || filename;
    
    // Find first paragraph after title
    const firstP = lines.find((l) => !l.startsWith("#") && !l.startsWith("---") && !l.startsWith("```")) || "";
    const shortDesc = firstP.length > 140 ? firstP.slice(0, 137) + "..." : firstP;

    return `- [${firstH1}](https://podomy.com/docs/${filename}.md): ${shortDesc}`;
  });

  const body = `# Podomy & Concord Architecture Context
> LLM and AI Agent Manifest. For consolidated full documentation text, see https://podomy.com/llms-full.txt

Podomy is an engineering studio developing distributed systems, edge coordination software, and computational simulation tools for physical machines and decentralized networks.

Concord is Podomy's core partition-native coordination runtime designed for intermittent, disconnected, and air-gapped machine environments (mining fleets, autonomous underwater vehicles, industrial edge systems, aerospace swarms).

## Concord Documentation
${docsEntries.join("\n")}

## Full Documentation Dump
- [Full Concord Documentation Bundle](https://podomy.com/llms-full.txt): Complete, concatenated plain-text context of all Concord architectural and technical documentation.

## Core Website Pages
- [About](https://podomy.com/): Podomy company overview, core focus, and values.
- [Concord](https://podomy.com/concord/): Concord project technical specifications.
- [Pricing](https://podomy.com/pricing/): License pricing (AGPLv3 free tier, startup flat rate, enterprise per-node).
- [Contact](https://podomy.com/contact/): Direct engineering contact channel.
- [Terms](https://podomy.com/terms/): Terms of service.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
