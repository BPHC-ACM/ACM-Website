import { supabase } from './supabase';
import type { Database } from './database.types';
import type React from 'react';
import {
    Code,
    Palette,
    Brain,
    Smartphone,
    Database as DatabaseIcon,
    PenTool,
    DraftingCompass,
    CalendarRange,
    ChartNoAxesGantt,
    BrainCircuit,
    Bot,
} from 'lucide-react';

export type Domain = Database['public']['Tables']['domains']['Row'];

// Icon mapping - maps icon names from database to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'BrainCircuit': BrainCircuit,
    'Code': Code,
    'Bot': Bot,
    'Smartphone': Smartphone,
    'ChartNoAxesGantt': ChartNoAxesGantt,
    'CalendarRange': CalendarRange,
    'PenTool': PenTool,
    'DraftingCompass': DraftingCompass,
    'Database': DatabaseIcon,
    'Palette': Palette,
    'Brain': Brain,
};

// Fallback data for when database is not available
const fallbackDomains: DomainWithIcon[] = [
    {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Machine Learning',
        slug: 'machine-learning',
        content: 'Machine Learning domain content...',
        order_index: 1,
        published: true,
        icon: BrainCircuit,
        description: 'Explore data-driven solutions and AI models for real-world problems.',
    },
    {
        id: '2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Web Development',
        slug: 'web-development',
        content: 'Web Development domain content...',
        order_index: 2,
        published: true,
        icon: Code,
        description: 'Build and maintain modern, scalable web applications using the latest technologies.',
    },
    {
        id: '3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Gen AI',
        slug: 'gen-ai',
        content: 'Gen AI domain content...',
        order_index: 3,
        published: true,
        icon: Bot,
        description: 'Work on generative AI models and cutting-edge artificial intelligence research.',
    },
    {
        id: '4',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'App Development',
        slug: 'app-development',
        content: 'App Development domain content...',
        order_index: 4,
        published: true,
        icon: Smartphone,
        description: 'Create mobile applications for Android and iOS platforms.',
    },
    {
        id: '5',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Quant',
        slug: 'quant',
        content: 'Quant domain content...',
        order_index: 5,
        published: true,
        icon: ChartNoAxesGantt,
        description: 'Apply mathematical and statistical techniques to solve complex problems.',
    },
    {
        id: '6',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Events',
        slug: 'events',
        content: 'Events domain content...',
        order_index: 6,
        published: true,
        icon: CalendarRange,
        description: 'Organize and manage ACM events, workshops, and hackathons.',
    },
    {
        id: '7',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Content',
        slug: 'content',
        content: 'Content domain content...',
        order_index: 7,
        published: true,
        icon: PenTool,
        description: 'Create engaging articles, blogs, and documentation for ACM initiatives.',
    },
    {
        id: '8',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: 'Design',
        slug: 'design',
        content: 'Design domain content...',
        order_index: 8,
        published: true,
        icon: DraftingCompass,
        description: 'Design graphics, UI/UX, and visual assets for ACM projects.',
    },
];

export interface DomainWithIcon extends Omit<Domain, 'icon_name'> {
    icon: React.ComponentType<{ className?: string }>;
}

/**
 * Fetch all published domains from the database, ordered by order_index
 */
export async function getDomains(): Promise<DomainWithIcon[]> {
    try {
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('published', true)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching domains:', error);
            console.log('Falling back to static domain data...');
            return fallbackDomains;
        }

        // Map icon names to actual icon components
        return data.map(domain => ({
            ...domain,
            icon: iconMap[domain.icon_name] || Code, // Fallback to Code icon if not found
        }));
    } catch (error) {
        console.error('Failed to connect to database:', error);
        console.log('Using fallback domain data...');
        return fallbackDomains;
    }
}

/**
 * Fetch a single domain by slug
 */
export async function getDomainBySlug(slug: string): Promise<DomainWithIcon | null> {
    try {
        const { data, error } = await supabase
            .from('domains')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned, try fallback
                const fallbackDomain = fallbackDomains.find(d => d.slug === slug);
                return fallbackDomain || null;
            }
            console.error('Error fetching domain:', error);
            // Try fallback
            const fallbackDomain = fallbackDomains.find(d => d.slug === slug);
            return fallbackDomain || null;
        }

        return {
            ...data,
            icon: iconMap[data.icon_name] || Code,
        };
    } catch (error) {
        console.error('Failed to connect to database:', error);
        // Use fallback data
        const fallbackDomain = fallbackDomains.find(d => d.slug === slug);
        return fallbackDomain || null;
    }
}

/**
 * Get all domain slugs for static generation
 */
export async function getAllDomainSlugs(): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('domains')
            .select('slug')
            .eq('published', true);

        if (error) {
            console.error('Error fetching domain slugs:', error);
            return fallbackDomains.map(domain => domain.slug);
        }

        return data.map(domain => domain.slug);
    } catch (error) {
        console.error('Failed to connect to database:', error);
        return fallbackDomains.map(domain => domain.slug);
    }
}

/**
 * Admin function to create a new domain
 */
export async function createDomain(domainData: Database['public']['Tables']['domains']['Insert']): Promise<Domain> {
    const { data, error } = await supabase
        .from('domains')
        .insert(domainData)
        .select()
        .single();

    if (error) {
        console.error('Error creating domain:', error);
        throw new Error('Failed to create domain');
    }

    return data;
}

/**
 * Admin function to update a domain
 */
export async function updateDomain(id: string, updates: Database['public']['Tables']['domains']['Update']): Promise<Domain> {
    const { data, error } = await supabase
        .from('domains')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating domain:', error);
        throw new Error('Failed to update domain');
    }

    return data;
}

/**
 * Admin function to delete a domain
 */
export async function deleteDomain(id: string): Promise<void> {
    const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting domain:', error);
        throw new Error('Failed to delete domain');
    }
}
