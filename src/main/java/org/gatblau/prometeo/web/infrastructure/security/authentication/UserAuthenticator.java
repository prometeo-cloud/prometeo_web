package org.gatblau.prometeo.web.infrastructure.security.authentication;

import io.jsonwebtoken.*;
import io.jsonwebtoken.impl.TextCodec;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Value;
import org.gatblau.prometeo.web.infrastructure.util.RandomKeyGenerator;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.util.Date;


@Named
@Singleton
public class UserAuthenticator {

    @Value("${ADMIN_USER:admin}")
    private String adminUser;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    private final RandomKeyGenerator randomKeyGenerator;

    @Inject
    public UserAuthenticator(final RandomKeyGenerator randomKeyGenerator) {
        this.randomKeyGenerator = randomKeyGenerator;
    }

    private String getSecretKey() {
        return "CHANGE_ME_TO_@VALUE";
    }

    private String generateJwtTokenForUser(final String userName) {
        return generateJwtTokenForUser(userName, 24);
    }

    private String generateJwtTokenForUser(final String userName,
                                          final int validFor) {
        final Date issueDate = new Date();

        return Jwts.builder()
                .setId(randomKeyGenerator.generate())
                .setSubject(userName)
                .setIssuedAt(issueDate)
                .setExpiration(DateUtils.addHours(issueDate, validFor))
                .signWith(SignatureAlgorithm.HS256, TextCodec.BASE64.encode(getSecretKey()))
                .claim(UserPrincipal.ClaimProperties.EMAIL, userName)
                .compact();
    }

    public UserPrincipal validateToken(final String token) {
        try {
            final Claims claims = Jwts.parser()
                    .setSigningKey(TextCodec.BASE64.encode(getSecretKey()))
                    .parseClaimsJws(token).getBody();
            return new UserPrincipal(token, Token.Status.VALID, claims);
        } catch (ExpiredJwtException expiredJwtException) {
            return new UserPrincipal(token, Token.Status.EXPIRED);
        } catch (SignatureException signatureException) {
            return new UserPrincipal(token, Token.Status.INVALID);
        }
    }

    public Claims parseToken(final String token) {
        return Jwts.parser()
                .setSigningKey(TextCodec.BASE64.encode(getSecretKey()))
                .parseClaimsJws(token).getBody();
    }

    public UserPrincipal authenticate(final String username,
                                      final String plaintextPassword) {
        if (username.equalsIgnoreCase(adminUser) && plaintextPassword.equals(adminPassword)) {
            return validateToken(generateJwtTokenForUser(username));
        } else {
            return null;
        }
    }
}

