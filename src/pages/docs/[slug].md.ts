import type { APIRoute } from "astro";
import { slugFromPath } from "../../lib/docs";

export async function getStaticPaths() {
  const docModules = import.meta.glob("/docs/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return Object.entries(docModules).map(([filepath, rawContent]) => {
    const filename = slugFromPath(filepath);
    const content = typeof rawContent === "string" ? rawContent : "";

    return {
      params: { slug: filename },
      props: { content },
    };
  });
}

export const GET: APIRoute = async ({ params, props }) => {
  let content = (props as { content?: string })?.content;

  if (!content && params.slug) {
    const docModules = import.meta.glob("/docs/*.md", {
      eager: true,
      query: "?raw",
      import: "default",
    });
    const key = Object.keys(docModules).find((k) =>
      k.endsWith(`/${params.slug}.md`)
    );
    if (key && typeof docModules[key] === "string") {
      content = docModules[key] as string;
    }
  }

  if (!content) {
    return new Response("404: Document Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
