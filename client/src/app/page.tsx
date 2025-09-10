'use client';

import { useAuth } from '@/store/AuthContexts';
import { useRouter } from 'next/navigation';
import ThreadsBackground from '@/components/bits/Threads/ThreadsBackground';

export default function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleLoginRedirect = () => {
        const clientId = 'oauth2-client-app';
        const redirectUri = 'http://localhost:3000/auth/callback';
        const scope = 'openid read write';
        const responseType = 'code';
        const authorizationUrl = `http://localhost:9000/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
        window.location.href = authorizationUrl;
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen bg-black text-white'>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <ThreadsBackground />
            <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>
                <div className='w-full max-w-sm rounded-2xl bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl border border-white/20'>
                    {isAuthenticated ? (
                        <>
                            <h1 className='text-3xl font-extrabold text-white mb-6'>
                                환영합니다!
                            </h1>
                            <button
                                onClick={() => router.push('/profile')}
                                className='w-full rounded-full bg-gradient-to-r from-green-500 to-teal-600 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105'
                            >
                                프로필 페이지 보기
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className='text-3xl font-extrabold text-white mb-6'>
                                OAuth 2.0 Login
                            </h1>
                            <button
                                onClick={handleLoginRedirect}
                                className='w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105'
                            >
                                Spring으로 로그인
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
