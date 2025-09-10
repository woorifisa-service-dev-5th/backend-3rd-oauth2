package dev.woori.WooriServer.oauth.dto;

public record UserInfoResponse(
        String sub,
        String email,
        String name
) {
}
