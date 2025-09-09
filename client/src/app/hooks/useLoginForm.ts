'use client';

import { useState } from 'react';

interface FormValues {
    userId: string;
    password: string;
}

interface FormErrors {
    userId?: string;
    password?: string;
}

export const useLoginForm = () => {
    const [values, setValues] = useState<FormValues>({
        userId: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (values.userId.length < 4) {
            newErrors.userId = '아이디는 4자 이상이어야 합니다.';
        }
        if (values.password.length < 4) {
            newErrors.password = '비밀번호는 4자 이상이어야 합니다.';
        }
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        // 유효성 검사를 통과하면 로그인 로직을 실행합니다.
        if (Object.keys(validationErrors).length === 0) {
            console.log('로그인 성공:', values);
            // 실제 애플리케이션에서는 여기에서 API를 호출합니다.
        } else {
            console.log('유효성 검사 실패');
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
};
