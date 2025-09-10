'use client';

import { useState } from 'react';
// 1. useRouter와 useAuth를 import 합니다.
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContexts';

interface FormValues {
    userId: string;
    password: string;
    bio?: string;
}

interface FormErrors {
    userId?: string;
    password?: string;
    bio?: string;
}

export const useLoginForm = () => {
    const [values, setValues] = useState<FormValues>({
        userId: '',
        password: '',
        bio: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();
    const { login } = useAuth();

    // 1. handleChange의 이벤트 타입을 확장합니다.
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // <--- 이 부분 수정
    ) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validate = (isProfileUpdate = false): FormErrors => {
        const newErrors: FormErrors = {};
        if (values.userId.length < 4) {
            newErrors.userId = '아이디는 4자 이상이어야 합니다.';
        }
        if (!isProfileUpdate || (isProfileUpdate && values.password)) {
            if (values.password.length < 4) {
                newErrors.password = '비밀번호는 4자 이상이어야 합니다.';
            }
        }
        return newErrors;
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        callback?: () => void
    ) => {
        e.preventDefault();
        const isProfileUpdate = !!callback;
        const validationErrors = validate(isProfileUpdate);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // 3. 로그인 및 페이지 이동 로직을 다시 추가합니다.
            if (callback) {
                // 프로필 업데이트 콜백이 있는 경우
                callback();
            } else {
                // 일반 로그인 처리
                const isLoggedIn = login(values.userId, values.password);
                if (isLoggedIn) {
                    // 로그인 성공 시 '/profile'로 이동
                    router.push('/profile');
                } else {
                    // 로그인 실패 시 에러 메시지 설정
                    setErrors({
                        userId: '아이디 또는 비밀번호가 일치하지 않습니다.',
                    });
                }
            }
        }
    };

    return {
        values,
        errors,
        setValues,
        handleChange,
        handleSubmit,
    };
};
