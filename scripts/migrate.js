import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import TurndownService from 'turndown';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VAULT_DIR = '/root/.openclaw/vault/20-Areas/Negocios/Editorial/Publicados/Conectando-Ideas';
const WP_POSTS_FILE = '/tmp/wp-posts.json';
const WP_CATS_FILE = '/tmp/wp-categories.json';
const WP_TAGS_FILE = '/tmp/wp-tags.json';
const OUT_CONTENT_DIR = path.join(ROOT, 'src/content/blog');
const OUT_IMAGES_DIR = path.join(ROOT, 'src/assets/posts');

const turndown = new TurndownService({
	headingStyle: 'atx',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
});

// Keep YouTube iframes as placeholders to replace later
turndown.addRule('youtube', {
	filter(node) {
		return node.nodeName === 'IFRAME' && /youtube\.com|youtu\.be/.test(node.getAttribute('src') || '');
	},
	replacement(_content, node) {
		const src = node.getAttribute('src') || '';
		const match = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
		const id = match ? match[1] : '';
		return id ? `\n<YouTubeEmbed id="${id}" />\n` : '';
	},
});

turndown.addRule('separator', {
	filter: 'hr',
	replacement() {
		return '\n---\n';
	},
});

function normalizeSlug(slug) {
	return slug
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function stripHtml(html) {
	return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseVaultFrontmatter(content) {
	if (!content.startsWith('---')) return null;
	const end = content.indexOf('---', 3);
	if (end === -1) return null;
	const raw = content.slice(3, end).trim();
	try {
		return yamlLoad(raw);
	} catch {
		return null;
	}
}

function vaultBody(content) {
	const end = content.indexOf('---', 3);
	return end === -1 ? content : content.slice(end + 3).trim();
}

async function downloadImage(url, outPath) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
	const buffer = Buffer.from(await res.arrayBuffer());
	await fs.mkdir(path.dirname(outPath), { recursive: true });
	await fs.writeFile(outPath + '.tmp', buffer);
	await sharp(outPath + '.tmp')
		.resize({ width: 1200, height: 630, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 85 })
		.toFile(outPath);
	await fs.unlink(outPath + '.tmp');
	return outPath;
}

async function findVaultFile(slug) {
	const files = await fs.readdir(VAULT_DIR);
	const normalized = normalizeSlug(slug);
	// Exact match first
	for (const f of files) {
		if (f.toLowerCase().replace(/\.md$/, '') === normalized) return path.join(VAULT_DIR, f);
	}
	// Substring match
	for (const f of files) {
		const fSlug = normalizeSlug(f.replace(/\.md$/, ''));
		if (fSlug.includes(normalized) || normalized.includes(fSlug)) return path.join(VAULT_DIR, f);
	}
	return null;
}

async function main() {
	const posts = JSON.parse(await fs.readFile(WP_POSTS_FILE, 'utf-8'));
	const categories = Object.fromEntries(
		JSON.parse(await fs.readFile(WP_CATS_FILE, 'utf-8')).map((c) => [c.id, { slug: c.slug, name: c.name }]),
	);
	const tags = Object.fromEntries(
		JSON.parse(await fs.readFile(WP_TAGS_FILE, 'utf-8')).map((t) => [t.id, { slug: t.slug, name: t.name }]),
	);

	await fs.mkdir(OUT_CONTENT_DIR, { recursive: true });
	await fs.mkdir(OUT_IMAGES_DIR, { recursive: true });

	const results = [];

	for (const post of posts) {
		const slug = post.slug;
		const vaultFile = await findVaultFile(slug);
		let body = '';
		let vaultMeta = null;

		if (vaultFile) {
			const raw = await fs.readFile(vaultFile, 'utf-8');
			vaultMeta = parseVaultFrontmatter(raw);
			body = vaultBody(raw);
			// Replace any direct YouTube URLs that might remain
		} else {
			body = turndown.turndown(post.content.rendered);
		}

		// Build Astro frontmatter
		const title = vaultMeta?.nombre || post.title.rendered;
		const description =
			stripHtml(post.excerpt.rendered).slice(0, 160) || stripHtml(body).slice(0, 160);
		const pubDate = post.date_gmt.split('T')[0];
		const wpCategory = post.categories.map((id) => categories[id]?.slug).find(Boolean) || 'general';
		const categoryMap = {
			domotica: 'domotica',
			'energia-solar': 'energia-solar',
			tecnologia: 'tecnologia',
			vida: 'vida',
			'sin-categoria': 'vida',
			uncategorized: 'vida',
		};
		const category = categoryMap[wpCategory] || 'vida';
		const tagList = post.tags.map((id) => tags[id]?.slug).filter(Boolean);
		const mergedTags = Array.from(new Set([...(vaultMeta?.tags || []), ...tagList]));

		// Featured image
		let heroImage = null;
		if (post.featured_media) {
			try {
				const mediaRes = await fetch(`https://luisolavea.com/wp-json/wp/v2/media/${post.featured_media}`);
				if (mediaRes.ok) {
					const media = await mediaRes.json();
					const url = media.source_url;
					const imageSlug = `${slug}-hero`;
					const outPath = path.join(OUT_IMAGES_DIR, `${imageSlug}.webp`);
					await downloadImage(url, outPath);
					heroImage = `../../assets/posts/${imageSlug}.webp`;
				}
			} catch (err) {
				console.warn(`[${slug}] Failed to download featured image:`, err.message);
			}
		}

		const frontmatter = {
			title,
			description,
			pubDate,
			category,
			tags: mergedTags,
			...(heroImage && { heroImage }),
		};

		const frontmatterYaml = yamlDump(frontmatter, { lineWidth: -1 }).trim();
		const hasYouTube = body.includes('<YouTubeEmbed');
		const ext = hasYouTube ? '.mdx' : '.md';
		const importStatement = hasYouTube
			? 'import YouTubeEmbed from \'../../components/YouTubeEmbed.astro\';\n\n'
			: '';

		const output = `---\n${frontmatterYaml}\n---\n\n${importStatement}${body}\n`;

		await fs.writeFile(path.join(OUT_CONTENT_DIR, `${slug}${ext}`), output);
		results.push({ slug, vault: !!vaultFile, heroImage });
	}

	console.table(results);
	console.log(`Migrated ${results.length} posts`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
