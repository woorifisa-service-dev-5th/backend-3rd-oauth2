'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/AuthContexts'; // useAuth 훅 임포트

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const { login } = useAuth(); // login 함수 사용
    const [message, setMessage] = useState('로그인 처리 중입니다...');
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code && !hasFetched.current) {
            hasFetched.current = true;

            fetch(`http://localhost:8080/api/login?code=${code}`, {
                method: 'POST',
            })
                .then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        // Context의 login 함수를 호출하여 후속 처리를 위임합니다.
                        await login(data.accessToken);
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
    }, [searchParams, login]);

    return (
        <div className='flex items-center justify-center h-screen bg-black text-white'>
            <p className={error ? 'text-red-400' : ''}>{error || message}</p>
        </div>
    );
}
