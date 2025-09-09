'use client';

import Image from 'next/image';
import ThreadsBackground from '@/components/bits/Threads/ThreadsBackground';
import { useLoginForm } from '@/hooks/useLoginForm'; // 1. 방금 만든 커스텀 훅을 import 합니다.

export default function Home() {
    const { values, errors, handleChange, handleSubmit } = useLoginForm();

    return (
        <main className='relative h-screen w-screen overflow-hidden bg-black'>
            <ThreadsBackground />

            <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>
                <div className='w-full max-w-sm rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-300 ease-out'>
                    <div className='mb-6 flex flex-col items-center gap-4'>
                        <Image
                            src='/images/wooricard_logo.png'
                            alt='Woori Card Logo'
                            width={60}
                            height={60}
                        />
                        <h1 className='text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-lg'>
                            Login
                        </h1>
                        <p className='text-sm text-gray-300'></p>
                    </div>

                    {/* 4. form에 onSubmit 핸들러를 연결합니다. */}
                    <form className='flex flex-col' onSubmit={handleSubmit}>
                        <div className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='userId'
                                    className='mb-2 block text-sm font-semibold text-gray-200'
                                >
                                    User ID
                                </label>
                                <input
                                    type='text'
                                    id='userId'
                                    name='userId'
                                    value={values.userId} // 5. 상태와 연결
                                    onChange={handleChange} // 5. 핸들러와 연결
                                    className='w-full rounded-lg border border-white/30 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 ease-in-out focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
                                    placeholder='Enter your ID'
                                />
                                {/* 6. 아이디 유효성 검사 오류 메시지를 표시합니다. */}
                                {errors.userId && (
                                    <p className='mt-2 text-xs text-red-400'>
                                        {errors.userId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor='password'
                                    className='mb-2 block text-sm font-semibold text-gray-200'
                                >
                                    Password
                                </label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    value={values.password} // 5. 상태와 연결
                                    onChange={handleChange} // 5. 핸들러와 연결
                                    className='w-full rounded-lg border border-white/30 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 ease-in-out focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none'
                                    placeholder='••••'
                                />
                                {/* 6. 비밀번호 유효성 검사 오류 메시지를 표시합니다. */}
                                {errors.password && (
                                    <p className='mt-2 text-xs text-red-400'>
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='mt-10 w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 py-3.5 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black'
                        >
                            로그인
                        </button>

                        <div
                            className='mt-6 flex items-center'
                            aria-hidden='true'
                        >
                            <div className='w-full border-t border-white/20' />
                            <div className='px-4 text-xs font-medium text-gray-400'>
                                OR
                            </div>
                            <div className='w-full border-t border-white/20' />
                        </div>

                        <button
                            type='button'
                            className='mt-6 w-full rounded-full bg-white/10 py-3 text-base font-semibold text-white backdrop-blur-lg border border-white/30 shadow-md transition-all duration-300 ease-in-out hover:bg-white/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black'
                        >
                            간편 로그인 하기
                        </button>

                        <div className='mt-8 text-center text-sm'>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-blue-300 transition-colors duration-200 mr-4'
                            >
                                비밀번호 찾기
                            </a>
                            <a
                                href='#'
                                className='text-gray-400 hover:text-blue-300 transition-colors duration-200'
                            >
                                회원가입
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
