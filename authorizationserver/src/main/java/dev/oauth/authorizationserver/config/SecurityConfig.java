package dev.oauth.authorizationserver.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

// 사용자 인증을 위한 설정
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize ->
                        authorize
                                .anyRequest().authenticated()
                )
                .formLogin(Customizer.withDefaults());


        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 기존 'user' 사용자
        var user = User.withUsername("user")
                .password("{noop}1234")
                .roles("USER")
                .build();


        var testUser = User.withUsername("test")
                .password("{noop}1234")
                .roles("USER")
                .build();

        // 두 사용자를 모두 InMemoryUserDetailsManager에 등록
        return new InMemoryUserDetailsManager(user, testUser);
    }
}
