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
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserInfo(Authentication authentication) {
        if (authentication instanceof TokenAuthentication) {
            // 인증 객체에서 완전한 UserInfoResponse를 가져와 반환합니다.
            UserInfoResponse userInfo = ((TokenAuthentication) authentication).getUserInfo();
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.status(401).build();
    }
}