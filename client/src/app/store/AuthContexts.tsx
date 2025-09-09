'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { MOCK_USER } from '@/mocks/mock-data';
import { User } from '@/types/user';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userId: string, password: string) => boolean;
    logout: () => void;
    updateUser: (updatedInfo: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 페이지 로드 시 localStorage에서 사용자 정보를 불러옵니다.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userId: string, password: string): boolean => {
        if (userId === MOCK_USER.userId && password === MOCK_USER.password) {
            localStorage.setItem('user', JSON.stringify(MOCK_USER));
            setUser(MOCK_USER);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedInfo: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updatedInfo };
            // 실제라면 API 호출 후 상태를 업데이트합니다.
            // 지금은 Mock 데이터를 업데이트하는 것처럼 처리합니다.
            MOCK_USER.userId = updatedUser.userId;
            if (updatedInfo.password) {
                MOCK_USER.password = updatedInfo.password;
            }
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, updateUser }}
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
