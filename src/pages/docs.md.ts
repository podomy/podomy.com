import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const docModules = import.meta.glob("/docs/overview.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const content = Object.values(docModules)[0] || "";

  return new Response(typeof content === "string" ? content : "", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
