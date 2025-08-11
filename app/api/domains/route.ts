import { NextRequest, NextResponse } from 'next/server';
import { getDomains, createDomain } from '@/lib/domains';

// GET /api/domains - Fetch all published domains
export async function GET() {
    try {
        const domains = await getDomains();
        return NextResponse.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch domains' },
            { status: 500 }
        );
    }
}

// POST /api/domains - Create a new domain (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.icon_name || !body.content) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, icon_name, content' },
                { status: 400 }
            );
        }

        const domain = await createDomain(body);
        return NextResponse.json(domain, { status: 201 });
    } catch (error) {
        console.error('Error creating domain:', error);
        return NextResponse.json(
            { error: 'Failed to create domain' },
            { status: 500 }
        );
    }
}
