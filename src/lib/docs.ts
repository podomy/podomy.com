// Shared helpers for the synced Concord documentation modules.

export interface DocNavEntry {
	slug: string;
	label: string;
	order?: number;
}

interface DocModule {
	frontmatter?: {
		navTitle?: string;
		title?: string;
		order?: number;
	};
	getHeadings?: () => Array<{ depth: number; text: string }>;
}

// Canonical reading order when docs carry no explicit order.
export const PREFERRED_ORDER = [
	"overview",
	"architecture",
	"cli",
	"sdk",
	"deployment",
];

// Extract the doc slug from a module path such as "/docs/cli.md".
export function slugFromPath(filepath: string): string {
	return filepath.split("/").pop()?.replace(/\.md$/, "") || "";
}

// Resolve the sidebar label for a doc: navTitle, title, first H1, or title-cased slug.
export function docLabel(doc: DocModule, slug: string): string {
	const headings = doc.getHeadings ? doc.getHeadings() : [];
	const firstH1 =
		headings.find((h) => h.depth === 1)?.text || headings[0]?.text;

	return (
		doc.frontmatter?.navTitle ||
		doc.frontmatter?.title ||
		firstH1 ||
		slug
			.replace(/[-_]/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase())
	);
}

// Order docs by explicit order, then preferred order, then alphabetically.
export function compareSlugs(a: string, b: string): number {
	const idxA = PREFERRED_ORDER.indexOf(a);
	const idxB = PREFERRED_ORDER.indexOf(b);
	if (idxA !== -1 && idxB !== -1) return idxA - idxB;
	if (idxA !== -1) return -1;
	if (idxB !== -1) return 1;
	return a.localeCompare(b);
}

// Ordering comparator for nav entries.
export function compareDocs(a: DocNavEntry, b: DocNavEntry): number {
	if (a.order !== undefined && b.order !== undefined) {
		return a.order - b.order;
	}
	return compareSlugs(a.slug, b.slug);
}

// Build the sorted sidebar navigation from eager doc modules.
export function buildDocsNav(
	docModules: Record<string, unknown>,
): DocNavEntry[] {
	return Object.entries(docModules)
		.map(([filepath, module]) => {
			const slug = slugFromPath(filepath);
			const doc = (module || {}) as DocModule;
			const order = doc.frontmatter?.order;
			return {
				slug,
				label: docLabel(doc, slug),
				order: typeof order === "number" ? order : undefined,
			};
		})
		.sort(compareDocs);
}
