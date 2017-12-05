package org.gatblau.prometeo.web.infrastructure.security.authentication;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    public enum Role {USER, ADMIN}

    public interface ClaimProperties {
        String ROLE = "role";
        String ID = "id";
        String FORENAME = "forename";
        String SURNAME = "surname";
        String EMAIL = "email";
        String PHONE ="phone";
    }

    private final String authToken;
    private final Claims claims;
    private final Token.Status tokenStatus;
    private final String subject;

    public Role getRole() {
        return Role.ADMIN;
    }

    public Integer getId() {
        return new Integer(claims.get(ClaimProperties.ID).toString());
    }

    public String getForename() {
        return claims.get(ClaimProperties.FORENAME).toString();
    }

    public String getSurname() {
        return claims.get(ClaimProperties.SURNAME).toString();
    }

    public String getEmail() {
        return claims.get(ClaimProperties.EMAIL).toString();
    }

    public String getPhone() {
        return claims.get(ClaimProperties.PHONE).toString();
    }

    public UserPrincipal(final String authToken,
                         final Token.Status tokenStatus,
                         final Claims claims) {
        this.authToken = authToken;
        this.tokenStatus = tokenStatus;
        this.claims = claims;
        this.subject = claims.getSubject();
    }

    public UserPrincipal(final String authToken,
                         final Token.Status tokenStatus) {
        this.authToken = authToken;
        this.tokenStatus = tokenStatus;
        this.claims = null;
        this.subject = null;
    }

    public String getAuthToken() {
        return authToken;
    }

    public Claims getClaims() {
        return claims;
    }

    public Token.Status getTokenStatus() {
        return tokenStatus;
    }

    public String getSubject() {
        return subject;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(getRole().toString()));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

