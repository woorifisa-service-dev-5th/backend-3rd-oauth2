'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
    sub: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    logout: () => void;
    login: (token: string) => Promise<void>; // 로그인 함수 추가
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async (token: string | null) => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                localStorage.removeItem('accessToken');
                setUser(null);
            }
        } catch (error) {
            console.error('사용자 정보 조회 실패', error);
            localStorage.removeItem('accessToken');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        fetchUser(token);
    }, [fetchUser]);

    const login = async (token: string) => {
        localStorage.setItem('accessToken', token);
        // 토큰 저장 후, 사용자 정보를 즉시 다시 불러와 상태를 업데이트합니다.
        await fetchUser(token);
        // 상태 업데이트가 완료된 후 프로필 페이지로 이동합니다.
        router.push('/profile');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        // 로그아웃 후 상태가 확실히 반영되도록 전체 페이지를 새로고침하며 이동합니다.
        window.location.href = '/';
    };

    const isAuthenticated = !isLoading && !!user;

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, logout, login, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
