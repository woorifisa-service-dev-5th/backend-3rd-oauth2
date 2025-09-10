package dev.woori.WooriServer.auth;

import dev.woori.WooriServer.oauth.Constants;
import dev.woori.WooriServer.oauth.dto.TokenResponse;
import dev.woori.WooriServer.oauth.feign.FeignProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final FeignProvider feignProvider;

    public String getAccessToken(String code) {
        code = getOriginalCode(code);
        TokenResponse tokenResponse = feignProvider.getTokenFromAS(code);
        return tokenResponse.accessToken();
    }

    public String getUserInfo(String code) {
        code = getOriginalCode(code);
        return feignProvider.getGreetingFromRS(code).greeting();
    }

    private static String getOriginalCode(String code) {
        if (StringUtils.hasText(code) && code.startsWith(Constants.BEARER)) {
            code = code.substring(Constants.BEARER.length());
        }
        return code;
    }
}
