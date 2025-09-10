package dev.woori.WooriServer.oauth.feign;

import dev.woori.WooriServer.oauth.dto.GreetingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import static dev.woori.WooriServer.oauth.Constants.AUTH_HEADER;

@FeignClient(
        name = "resourceServer",
        url = "${oauth.resource_server_ip}"
)
public interface ResourceServerFeign {

    // 인증된 요청 (JWT 필요)
    @GetMapping("/api/authenticated/greeting")
    GreetingResponse getGreeting(@RequestHeader(AUTH_HEADER) String accessToken);

    // 공개 요청 (JWT 불필요)
    @GetMapping("/api/public/greeting")
    String getPublicGreeting();
}