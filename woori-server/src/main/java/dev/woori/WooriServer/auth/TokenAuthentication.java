package dev.woori.WooriServer.auth;

import dev.woori.WooriServer.oauth.dto.UserInfoResponse;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;


@Getter
public class TokenAuthentication implements Authentication {

    private final String token;
    private final UserInfoResponse userInfo;
    private boolean isAuthenticated;

    private TokenAuthentication(String token, UserInfoResponse userInfo) {
        this.token = token;
        this.userInfo = userInfo;
        this.isAuthenticated = true;
    }

    public static TokenAuthentication createTokenAuthentication(final String token, final UserInfoResponse userInfo) {
        return new TokenAuthentication(token, userInfo);
    }

    @Override
    public String getName() {
        return userInfo != null ? userInfo.name() : null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return Collections.emptyList(); }

    @Override
    public String getCredentials() { return token; }

    @Override
    public Object getDetails() { return null; }

    @Override
    public Object getPrincipal() { return this.userInfo; }

    @Override
    public boolean isAuthenticated() { return this.isAuthenticated; }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.isAuthenticated = isAuthenticated;
    }
}