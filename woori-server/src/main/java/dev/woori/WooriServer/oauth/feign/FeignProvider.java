package dev.woori.WooriServer.oauth.feign;

import dev.woori.WooriServer.oauth.dto.GreetingResponse;
import dev.woori.WooriServer.oauth.dto.TokenResponse;
import dev.woori.WooriServer.oauth.dto.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static dev.woori.WooriServer.oauth.Constants.*;

@Component
@RequiredArgsConstructor
public class FeignProvider {

    private final AuthServerFeign authServerFeign;
    private final ResourceServerFeign resourceServerFeign;

    @Value("${oauth.client_id}")
    private String clientId;

    @Value("${oauth.client_secret}")
    private String secret;

    @Value("${oauth.grant_type}")
    private String grantType;

    @Value("${oauth.redirect_uri}")
    private String redirectUri;


    public TokenResponse getTokenFromAS(final String code) {
        MultiValueMap<String, String> form = createReqForm(code);
        return authServerFeign.getToken(form);
    }

    public UserInfoResponse getUserInfoFromAS(String accessToken) {
        String token = accessToken.startsWith(BEARER)
                ? accessToken
                : BEARER + accessToken.trim();
        return authServerFeign.getUserInfo(token);
    }

    public GreetingResponse getGreetingFromRS(final String bearerToken) {
        return resourceServerFeign.getGreeting(bearerToken);
    }

    public String getPublicFromRS() {
        return resourceServerFeign.getPublicGreeting();
    }

    private MultiValueMap<String, String> createReqForm(final String code) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add(GRANT_TYPE, grantType);
        form.add(CLIENT_ID, clientId);
        form.add(CLIENT_SECRET, secret);
        form.add(REDIRECT_URL, redirectUri);
        form.add(CODE, code);

        return form;
    }
}
