import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return new NextResponse('Authorization code not found', {
            status: 400,
        });
    }

    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const redirectUri = 'http://127.0.0.1:8081/auth/callback';
    const tokenUrl = 'http://localhost:9000/oauth2/token';

    if (!clientId || !clientSecret) {
        return new NextResponse('Client ID or Secret is not configured', {
            status: 500,
        });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    try {
        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // Basic Authentication 헤더 추가
                Authorization: `Basic ${Buffer.from(
                    `${clientId}:${clientSecret}`
                ).toString('base64')}`,
            },
            body: params,
        });

        if (!tokenResponse.ok) {
            const errorBody = await tokenResponse.text();
            console.error('Failed to fetch token:', errorBody);
            return new NextResponse(`Failed to fetch token: ${errorBody}`, {
                status: tokenResponse.status,
            });
        }

        const tokens = await tokenResponse.json();

        // 토큰을 HttpOnly, Secure 쿠키에 저장
        cookies().set('access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: tokens.expires_in,
            path: '/',
        });

        return new NextResponse('Login successful', { status: 200 });
    } catch (error) {
        console.error('Token exchange error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
