import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    // 쿠키 삭제
    cookies().delete('access_token');
    cookies().delete('refresh_token');
    return new NextResponse('Logged out', { status: 200 });
}
