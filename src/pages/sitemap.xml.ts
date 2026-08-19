import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const docModules = import.meta.glob("/docs/*.md", { eager: true });
  const siteUrl = "https://podomy.com";

  const staticPages = [
    { loc: `${siteUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${siteUrl}/concord/`, changefreq: "weekly", priority: "0.9" },
    { loc: `${siteUrl}/docs/`, changefreq: "daily", priority: "0.9" },
    { loc: `${siteUrl}/pricing/`, changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/contact/`, changefreq: "monthly", priority: "0.7" },
    { loc: `${siteUrl}/terms/`, changefreq: "monthly", priority: "0.5" },
    { loc: `${siteUrl}/llms.txt`, changefreq: "daily", priority: "0.8" },
    { loc: `${siteUrl}/llms-full.txt`, changefreq: "daily", priority: "0.8" },
  ];

  const docPages = Object.keys(docModules).flatMap((filepath) => {
    const slug = filepath.split("/").pop()?.replace(".md", "") || "";
    return [
      { loc: `${siteUrl}/docs/${slug}/`, changefreq: "daily", priority: "0.8" },
      { loc: `${siteUrl}/docs/${slug}.md`, changefreq: "daily", priority: "0.7" },
    ];
  });

  const allPages = [...staticPages, ...docPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
