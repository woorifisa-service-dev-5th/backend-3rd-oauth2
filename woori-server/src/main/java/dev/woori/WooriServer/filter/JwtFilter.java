package dev.woori.WooriServer.filter;

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
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

import static dev.woori.WooriServer.auth.TokenAuthentication.createTokenAuthentication;
import static dev.woori.WooriServer.oauth.Constants.AUTH_HEADER;
import static org.springframework.cloud.openfeign.security.OAuth2AccessTokenInterceptor.BEARER;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final FeignProvider feignProvider;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        if ("POST".equalsIgnoreCase(request.getMethod())) {
            return pathMatcher.match("/api/login/**", uri);
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = getAccessToken(request);
        UserInfoResponse userInfo = feignProvider.getUserInfoFromAS(accessToken);
        doAuthentication(accessToken, userInfo.email());
        filterChain.doFilter(request, response);
    }


    private String getAccessToken(final HttpServletRequest request) throws ServletException, AccessDeniedException {
        final String accessToken = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasText(accessToken) && accessToken.startsWith(BEARER)) {
            return accessToken.substring(BEARER.length());
        }
        throw new AccessDeniedException("!!");
    }

    private void doAuthentication(final String token, final String email) {
        TokenAuthentication tokenAuthentication = createTokenAuthentication(token, email);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(tokenAuthentication);
    }
}
