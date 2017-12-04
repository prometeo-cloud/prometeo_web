package samm.infrastructure.security.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.impl.TextCodec;
import org.apache.commons.lang3.time.DateUtils;
import samm.data.user.UserRepository;
import samm.domain.user.model.User;
import samm.infrastructure.security.cipher.Cipher;
import samm.infrastructure.util.RandomKeyGenerator;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.util.Date;

@Named
@Singleton
public class UserAuthenticator {
    private final Cipher cipher;
    private final RandomKeyGenerator randomKeyGenerator;
    private final UserRepository userRepository;

    @Inject
    public UserAuthenticator(final Cipher cipher,
                             final RandomKeyGenerator randomKeyGenerator,
                             final UserRepository userRepository) {
        this.cipher = cipher;
        this.randomKeyGenerator = randomKeyGenerator;
        this.userRepository = userRepository;
    }

    private String getSecretKey() {
        return "CHANGE_ME_TO_@VALUE";
    }

    public String generateJwtTokenForUser(final User user,
                                          final Token.Type type) {
        final int validFor = type == Token.Type.PASSWORD_RESET ? 1 : 24;
        return generateJwtTokenForUser(user, validFor, type);
    }

    public String generateJwtTokenForUser(final User user,
                                          final int validFor,
                                          final Token.Type type) {
        final Date issueDate = new Date();

        return Jwts.builder()
            .setId(randomKeyGenerator.generate())
            .setSubject(user.getId().toString())
            .setIssuedAt(issueDate)
            .setExpiration(DateUtils.addHours(issueDate, validFor))
            .signWith(SignatureAlgorithm.HS256, TextCodec.BASE64.encode(getSecretKey()))
            .claim(UserPrincipal.ClaimProperties.ROLE, user.getRole().toString())
            .claim(UserPrincipal.ClaimProperties.TYPE, type.toString())
            .claim(UserPrincipal.ClaimProperties.ID, user.getId().toString())
            .claim(UserPrincipal.ClaimProperties.FORENAME, user.getForename())
            .claim(UserPrincipal.ClaimProperties.SURNAME, user.getSurname())
            .claim(UserPrincipal.ClaimProperties.EMAIL, user.getEmail())
            .claim(UserPrincipal.ClaimProperties.PHONE, user.getPhone())
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
        final Claims claims = Jwts.parser()
            .setSigningKey(TextCodec.BASE64.encode(getSecretKey()))
            .parseClaimsJws(token).getBody();
        return claims;
    }

    public UserPrincipal authenticate(final String username,
                                      final String plaintextPassword,
                                      final UserPrincipal.Role role) {
        final User user = userRepository.findUserByEmail(username, role);
        if (user != null && user.getActivationDate() != null) {
            if (cipher.verify(plaintextPassword, user.getPassword())) {
                return validateToken(generateJwtTokenForUser(user, Token.Type.ACCESS));
            }
        }
        return null;
    }
}

