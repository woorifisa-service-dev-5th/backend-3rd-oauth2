package dev.woori.WooriServer.oauth.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import static dev.woori.WooriServer.oauth.Constants.AUTH_HEADER;

@FeignClient(
        name = "resourceServer",
        url = "http://localhost:8081"   // 리소스 서버가 띄워진 주소/포트
)
public interface ResourceServerFeign {

    // 인증된 요청 (JWT 필요)
    @GetMapping("/api/authenticated/greeting")
    String getGreeting(@RequestHeader(AUTH_HEADER) String accessToken);

    // 공개 요청 (JWT 불필요)
    @GetMapping("/api/public/greeting")
    String getPublicGreeting();
}
