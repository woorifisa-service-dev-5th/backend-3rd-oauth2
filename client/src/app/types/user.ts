export interface User {
    id: string;
    userId: string;
    password?: string;
    bio?: string; // 비밀번호는 선택적으로 표시될 수 있습니다.
}
