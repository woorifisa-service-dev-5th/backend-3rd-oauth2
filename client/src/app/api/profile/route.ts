import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const accessToken = cookies().get('access_token')?.value;

    if (!accessToken) {
        return new NextResponse('Access token not found', { status: 401 });
    }

    try {
        // Spring 서버의 userinfo 엔드포인트로 요청
        const userResponse = await fetch('http://localhost:9000/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            return new NextResponse('Failed to fetch user info', {
                status: userResponse.status,
            });
        }

        const userData = await userResponse.json();
        return NextResponse.json(userData);
    } catch (error) {
        console.error('User info fetch error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
