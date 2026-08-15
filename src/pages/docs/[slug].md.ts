import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const docModules = import.meta.glob("/docs/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return Object.entries(docModules).map(([filepath, rawContent]) => {
    const filename = filepath.split("/").pop()?.replace(".md", "") || "";
    const content = typeof rawContent === "string" ? rawContent : "";

    return {
      params: { slug: filename },
      props: { content },
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { content } = props as { content: string };

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
