package dev.woori.WooriServer.auth;

import dev.woori.WooriServer.oauth.dto.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam("code") String code) {
        String accessToken = authService.getAccessToken(code);
        // 프론트엔드에서 다루기 쉽도록 JSON 형태로 반환
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication) {
        if (authentication instanceof TokenAuthentication) {
            TokenAuthentication tokenAuth = (TokenAuthentication) authentication;
            // JwtFilter에서 가져온 사용자 정보를 UserInfoResponse 형태로 반환
            UserInfoResponse userInfo = new UserInfoResponse(
                    "temp-sub", // 필요하다면 이 값도 UserInfo에서 가져오도록 수정
                    tokenAuth.getCredentials(),
                    tokenAuth.getName()
            );
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.status(401).build();
    }
}