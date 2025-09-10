package dev.woori.WooriServer.filter; // Your package name

import dev.woori.WooriServer.auth.TokenAuthentication;
import dev.woori.WooriServer.oauth.dto.UserInfoResponse;
import dev.woori.WooriServer.oauth.feign.FeignProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

import static dev.woori.WooriServer.oauth.Constants.AUTH_HEADER;
import static org.springframework.cloud.openfeign.security.OAuth2AccessTokenInterceptor.BEARER;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final FeignProvider feignProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String requestURI = request.getRequestURI();
        return requestURI.equals("/api/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String accessToken = getAccessToken(request);
            // Bearer 접두사를 붙여서 Feign 클라이언트 호출
            UserInfoResponse userInfo = feignProvider.getUserInfoFromAS(BEARER + accessToken);
            doAuthentication(accessToken, userInfo);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication Failed: " + e.getMessage());
        }
    }


    private String getAccessToken(final HttpServletRequest request) throws AccessDeniedException {
        final String accessToken = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasText(accessToken) && accessToken.startsWith(BEARER)) {
            return accessToken.substring(BEARER.length());
        }
        throw new AccessDeniedException("Access Token is missing or invalid.");
    }

    private void doAuthentication(final String token, final UserInfoResponse userInfo) {
        TokenAuthentication tokenAuthentication = TokenAuthentication.createTokenAuthentication(token, userInfo);
        // SecurityContext를 새로 생성하여 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(tokenAuthentication);
        SecurityContextHolder.setContext(securityContext);
    }
}