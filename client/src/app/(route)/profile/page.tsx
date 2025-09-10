'use client';

import { useAuth } from '@/store/AuthContexts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ThreadsBackground from '@/components/bits/Threads/ThreadsBackground';

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // user 상태가 확정된 후, 로그인되지 않았다면 홈으로 보냅니다.
        if (!isAuthenticated) {
            // Context가 초기화될 시간을 주기 위해 약간의 지연 후 체크할 수 있습니다.
            // 하지만 이 구조에서는 useEffect가 실행될 때쯤이면 상태가 확정됩니다.
            router.push('/');
        }
    }, [isAuthenticated, router]);

    // 사용자 정보가 아직 로드되지 않았다면 로딩 화면을 보여줍니다.
    if (!user) {
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
                            <p className='p-3 bg-black/20 rounded-md mt-1'>
                                {user.sub}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-gray-400'>
                                이메일
                            </label>
                            <p className='p-3 bg-black/20 rounded-md mt-1'>
                                {user.email}
                            </p>
                        </div>
                        <div>
                            <label className='text-sm font-semibold text-gray-400'>
                                이름
                            </label>
                            <p className='p-3 bg-black/20 rounded-md mt-1'>
                                {user.name}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className='w-full mt-8 rounded-full text-sm hover:text-white bg-red-500/80 hover:bg-red-500 py-3 font-bold transition-colors'
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </main>
    );
}
