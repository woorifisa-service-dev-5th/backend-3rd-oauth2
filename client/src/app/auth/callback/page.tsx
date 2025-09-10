'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('로그인 처리 중입니다...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            // WooriServer의 /api/login으로 code 전송 (포트 8080 가정)
            fetch(`http://localhost:8080/api/login?code=${code}`, {
                method: 'POST',
            })
                .then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        // 성공 시, accessToken을 localStorage에 저장하고 프로필로 이동
                        localStorage.setItem('accessToken', data.accessToken);
                        router.push('/profile');
                    } else {
                        const errorText = await res.text();
                        throw new Error(`로그인 실패: ${errorText}`);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                });
        }
    }, [searchParams, router]);

    return (
        <div className='flex items-center justify-center h-screen bg-black text-white'>
            <p className={error ? 'text-red-400' : ''}>{error || message}</p>
        </div>
    );
}
