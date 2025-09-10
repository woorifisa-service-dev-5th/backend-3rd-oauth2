'use client';

import { useAuth } from '@/store/AuthContexts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ThreadsBackground from '@/components/bits/Threads/ThreadsBackground';

export default function ProfilePage() {
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 로딩이 끝나고, 인증되지 않은 상태가 확실할 때만 홈으로 리디렉션합니다.
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, router]);

    // 로딩 중이거나, (리디렉션 전) 유저가 없을 때 로딩 화면을 보여줍니다.
    if (isLoading || !user) {
        return (
            <div className='flex items-center justify-center h-screen bg-black text-white'>
                <p>프로필 정보를 로딩 중입니다...</p>
            </div>
        );
    }

    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <ThreadsBackground />
            <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>
                <div className='w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 text-white'>
                    <div className='mb-8 text-center'>
                        <h1 className='text-3xl font-extrabold'>
                            {user.name}님의 프로필
                        </h1>
                        <p className='text-gray-300 mt-2'>로그인 되었습니다!</p>
                    </div>

                    <div className='space-y-4 text-left'>
                        <div>
                            <label className='text-sm font-semibold text-gray-400'>
                                사용자 ID (sub)
                            </label>
                            <p className='p-3 bg-black/20 rounded-md mt-1 break-words'>
                                {user.sub}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-gray-400'>
                                이메일
                            </label>
                            <p className='p-3 bg-black/20 rounded-md mt-1 break-words'>
                                {user.email}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-gray-400'>
                                이름
                            </label>
                            <p className='p-3 bg-black/20 rounded-md mt-1 break-words'>
                                {user.name}
                            </p>
                        </div>
                    </div>

                    {/* --- 여기가 수정된 버튼 영역입니다 --- */}
                    <div className='flex items-center gap-4 mt-8'>
                        <button
                            onClick={() => router.push('/')}
                            className='w-full rounded-full bg-gray-500/80 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-500/100'
                        >
                            뒤로 가기
                        </button>
                        <button
                            onClick={logout}
                            className='w-full rounded-full bg-red-500/80 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500/100'
                        >
                            로그아웃
                        </button>
                    </div>
                    {/* ------------------------------------ */}
                </div>
            </div>
        </main>
    );
}
