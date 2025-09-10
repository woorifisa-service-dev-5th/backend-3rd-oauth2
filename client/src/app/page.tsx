'use client';

import { useAuth } from '@/store/AuthContexts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ThreadsBackground from '@/components/bits/Threads/ThreadsBackground';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // 이미 로그인 상태라면 프로필 페이지로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/profile');
        }
    }, [isAuthenticated, router]);

    const handleLogin = () => {
        const clientId = 'oauth2-client-app';
        const redirectUri = 'http://127.0.0.1:3000/auth/callback'; // 콜백 페이지 주소
        const scope = 'openid read write';
        const responseType = 'code';

        const authorizationUrl = `http://localhost:9000/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;

        // 해당 URL로 사용자를 리디렉션
        window.location.href = authorizationUrl;
    };

    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <ThreadsBackground />
            <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>
                <div className='w-full max-w-sm rounded-2xl bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl border border-white/20'>
                    <h1 className='text-3xl font-extrabold text-white mb-6'>
                        OAuth 2.0 Login
                    </h1>
                    <button
                        onClick={handleLogin}
                        className='w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105'
                    >
                        Spring으로 로그인
                    </button>
                </div>
            </div>
        </main>
    );
}
