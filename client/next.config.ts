import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // experimental 객체 없이 최상위 레벨에 직접 작성합니다.
    allowedDevOrigins: ['http://127.0.0.1:3000'],
};

export default nextConfig;
