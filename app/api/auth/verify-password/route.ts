import { NextResponse } from 'next/server';

// In a production environment, this should be stored securely (environment variable, database, etc.)
const BLOG_PASSWORD = process.env.BLOG_PASSWORD;

export async function POST(request: Request) {
	try {
		const { password } = await request.json();

		if (!password) {
			return NextResponse.json(
				{ error: 'Password is required' },
				{ status: 400 }
			);
		}

		if (password === BLOG_PASSWORD) {
			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Error verifying password:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}