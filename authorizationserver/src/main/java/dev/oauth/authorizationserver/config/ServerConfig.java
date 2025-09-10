package dev.oauth.authorizationserver.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// 인가 서버 설정
@Configuration(proxyBeanMethods = false)
public class ServerConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);

        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .oidc(oidc -> oidc
                                .userInfoEndpoint(userInfo -> userInfo
                                        // --- 여기가 1번 수정 지점입니다 ---
                                        .userInfoMapper(context -> {
                                            // 인증된 사용자의 아이디(username)를 올바르게 가져옵니다.
                                            String principalName = context.getAuthorization().getPrincipalName();

                                            Map<String, Object> claims = new HashMap<>();

                                            if ("test".equals(principalName)) {
                                                claims.put("sub", principalName);
                                                claims.put("name", "jonghyuck");
                                                claims.put("email", "jhcki222@gmail.com");
                                            } else { // "user" 또는 다른 사용자의 경우
                                                claims.put("sub", principalName);
                                                claims.put("name", "gugu");
                                                claims.put("email", "gugu@example.com");
                                            }

                                            return new OidcUserInfo(claims);
                                        })
                                )
                        );
//        // UserInfo 응답에 추가 claim 설정
//        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class).oidc(oidc -> {
//            oidc.userInfoEndpoint(userInfo -> userInfo.userInfoMapper(context -> {
//                String user = context.getAuthorization().getPrincipalName();
//                String username = "gugu";
//                return new OidcUserInfo(Map.of(
//                        "sub", user,
//                        "name", username,
//                        "email", username + "@example.com"
//                ));
//
//            }));
//        });


//        http.exceptionHandling(exception -> exception.(new LoginUrlAuthenticationEntryPoint("/login")));
        http.exceptionHandling(exceptions -> exceptions.defaultAuthenticationEntryPointFor(
                new LoginUrlAuthenticationEntryPoint("/login"),
                new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
        ))

        // 전달받은 액세스 토큰 검증 API
//        http.oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt); // TODO: jwt() deprecated
        .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder().issuer("http://localhost:9000").build();
    }

    // Client 수동 등록
        @Bean
        public RegisteredClientRepository registeredClientRepository() {
            var registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId("oauth2-client-app")
                    .clientSecret("{noop}secret")
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                    .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
                    .redirectUri("http://127.0.0.1:8081/auth/callback")
//                .redirectUri("http://127.0.0.1:8081/login/oauth2/code/oauth2-client-app")
                    .scope(OidcScopes.OPENID)
                    .scope("read")
                    .scope("write")
                    .clientSettings(ClientSettings.builder().requireAuthorizationConsent(true).build()) // 동의하기 페이지 활성화
                .build();

        return new InMemoryRegisteredClientRepository(registeredClient);

    }

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtCustomizer() {
        return context -> {
            Authentication principal = context.getPrincipal();
            if (principal != null && principal.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal.getPrincipal();
                String username = userDetails.getUsername(); // 실제 로그인한 사용자 아이디

                // 로그인한 사용자에 따라 다른 이름을 claim에 추가
                if ("test".equals(username)) {
                    context.getClaims().claim("name", "jonghyuck");
                } else {
                    context.getClaims().claim("name", "gugu");
                }
            }
        };
    }

    // JWT 토큰 검증 클래스
    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() throws NoSuchAlgorithmException {
        RSAKey rsaKey = generateRsa();
        JWKSet jwkSet = new JWKSet(rsaKey);

        return ((jwkSelector, context) -> jwkSelector.select(jwkSet));
    }

    private RSAKey generateRsa() throws NoSuchAlgorithmException {
        KeyPair keyPair = generateRsaKey();
        var rsaPrivateKey = (RSAPrivateKey) keyPair.getPrivate();
        var rsaPublicKey = (RSAPublicKey) keyPair.getPublic();

        return new RSAKey.Builder(rsaPublicKey)
                .privateKey(rsaPrivateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
    }

    private KeyPair generateRsaKey() throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        return keyPairGenerator.generateKeyPair();
    }

}
