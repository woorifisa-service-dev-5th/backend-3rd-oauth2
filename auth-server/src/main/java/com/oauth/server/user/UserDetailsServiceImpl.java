package com.oauth.server.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Spring Security가 사용자 인증 시 호출하는 메서드입니다.
     * 사용자 이름(username)으로 데이터베이스에서 사용자 정보를 찾아 UserDetails 객체로 반환합니다.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // DB에서 조회한 사용자 정보(username, password, roles)를 UserDetails 객체로 변환
        return new User(userEntity.getUsername(), userEntity.getPassword(), getAuthorities(userEntity.getRoles()));
    }

    /**
     * 사용자 역할(roles) 문자열을 GrantedAuthority 컬렉션으로 변환합니다.
     * 예: "ROLE_USER,ROLE_ADMIN" -> [SimpleGrantedAuthority(ROLE_USER), SimpleGrantedAuthority(ROLE_ADMIN)]
     */
    private Collection<? extends GrantedAuthority> getAuthorities(String roles) {
        return Arrays.stream(roles.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
