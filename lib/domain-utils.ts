// Domain ID to URL slug mappings
const domainSlugMap: { [key: string]: string } = {
	'machine-learning': 'ml',
	'web-development': 'webdevelopment',
	'gen ai': 'genai',
	'mobile-development': 'appdevelopment',
	'Quant': 'quant',
	'events': 'events',
	'content': 'content',
	'design': 'design'
};

// Reverse mapping for slug to domain ID
const slugDomainMap: { [key: string]: string } = Object.fromEntries(
	Object.entries(domainSlugMap).map(([id, slug]) => [slug, id])
);

/**
 * Convert domain ID to URL slug
 */
export function domainIdToSlug(id: string): string {
	return domainSlugMap[id] || id.toLowerCase().replace(/\s+/g, '');
}

/**
 * Convert URL slug to domain ID
 */
export function slugToDomainId(slug: string): string {
	return slugDomainMap[slug] || slug;
}

/**
 * Get all valid domain slugs for static generation
 */
export function getAllDomainSlugs(): string[] {
	return Object.values(domainSlugMap);
}
