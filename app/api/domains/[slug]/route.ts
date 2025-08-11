import { NextRequest, NextResponse } from 'next/server';
import { getDomainBySlug, updateDomain, deleteDomain } from '@/lib/domains';

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

// GET /api/domains/[slug] - Fetch domain by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const domain = await getDomainBySlug(slug);

        if (!domain) {
            return NextResponse.json(
                { error: 'Domain not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(domain);
    } catch (error) {
        console.error('Error fetching domain:', error);
        return NextResponse.json(
            { error: 'Failed to fetch domain' },
            { status: 500 }
        );
    }
}

// PUT /api/domains/[slug] - Update domain (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const body = await request.json();

        // First find the domain by slug to get the ID
        const existingDomain = await getDomainBySlug(slug);
        if (!existingDomain) {
            return NextResponse.json(
                { error: 'Domain not found' },
                { status: 404 }
            );
        }

        const updatedDomain = await updateDomain(existingDomain.id, body);
        return NextResponse.json(updatedDomain);
    } catch (error) {
        console.error('Error updating domain:', error);
        return NextResponse.json(
            { error: 'Failed to update domain' },
            { status: 500 }
        );
    }
}

// DELETE /api/domains/[slug] - Delete domain (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;

        // First find the domain by slug to get the ID
        const existingDomain = await getDomainBySlug(slug);
        if (!existingDomain) {
            return NextResponse.json(
                { error: 'Domain not found' },
                { status: 404 }
            );
        }

        await deleteDomain(existingDomain.id);
        return NextResponse.json({ message: 'Domain deleted successfully' });
    } catch (error) {
        console.error('Error deleting domain:', error);
        return NextResponse.json(
            { error: 'Failed to delete domain' },
            { status: 500 }
        );
    }
}
