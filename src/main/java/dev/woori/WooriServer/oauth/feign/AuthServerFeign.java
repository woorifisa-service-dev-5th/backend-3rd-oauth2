package dev.woori.WooriServer.oauth.feign;

import dev.woori.WooriServer.oauth.dto.TokenResponse;
import dev.woori.WooriServer.oauth.dto.UserInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import static dev.woori.WooriServer.oauth.Constants.AUTH_HEADER;

@FeignClient(
        name = "token",
        url = "http://localhost:9000"
)
public interface AuthServerFeign {

    @PostMapping(value = "/oauth2/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenResponse getToken(@RequestBody MultiValueMap<String, String> form);

    @GetMapping("/userinfo")
    UserInfoResponse getUserInfo(@RequestHeader(AUTH_HEADER) String accessToken);

    @GetMapping("/introspect")
    void checkIntrospect(@RequestBody MultiValueMap<String, String> form);
}
