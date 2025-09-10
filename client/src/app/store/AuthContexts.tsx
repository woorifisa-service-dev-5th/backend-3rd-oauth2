'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
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
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    // WooriServer의 /api/user로 사용자 정보 요청
                    const res = await fetch('http://localhost:8080/api/user', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        // 토큰이 유효하지 않은 경우
                        localStorage.removeItem('accessToken');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('사용자 정보 조회 실패', error);
                    localStorage.removeItem('accessToken');
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        router.push('/');
    };

    const isAuthenticated = !isLoading && !!user;

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, logout, isLoading }}
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
