import { getAllDomainSlugs as getDomainsFromDB } from './domains';

// Legacy domain ID to URL slug mappings for backward compatibility
const legacyDomainSlugMap: { [key: string]: string } = {
	'machine-learning': 'machine-learning',
	'web-development': 'web-development',
	'gen ai': 'gen-ai',
	'app-development': 'app-development',
	'Quant': 'quant',
	'events': 'events',
	'content': 'content',
	'design': 'design'
};

/**
 * Convert domain ID to URL slug (legacy support)
 * Now that we're using database, this is mainly for backwards compatibility
 */
export function domainIdToSlug(id: string): string {
	return legacyDomainSlugMap[id] || id.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert URL slug to domain ID (legacy support)
 * Since we now store slugs directly in the database, this is mainly for compatibility
 */
export function slugToDomainId(slug: string): string {
	// Return the slug as-is since we're now using database slugs directly
	return slug;
}

/**
 * Get all valid domain slugs for static generation
 * This now fetches from the database
 */
export async function getAllDomainSlugs(): Promise<string[]> {
	try {
		return await getDomainsFromDB();
	} catch (error) {
		console.error('Failed to fetch domain slugs from database:', error);
		// Fallback to legacy slugs if database is unavailable
		return Object.values(legacyDomainSlugMap);
	}
}
