package samm.endpoint.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import samm.domain.user.model.Credentials;
import samm.domain.user.service.AuthenticateOperation;
import samm.infrastructure.security.authentication.UserPrincipal;

import javax.inject.Inject;
import javax.persistence.NonUniqueResultException;
import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.util.Base64;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController
public class LoginEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(LoginEndpoint.class);

    public static final String BASIC = "Basic ";

    private final AuthenticateOperation authenticateOperation;

    @Inject
    public LoginEndpoint(AuthenticateOperation authenticateOperation) {
        this.authenticateOperation = authenticateOperation;
    }

    @Transactional
    @RequestMapping(value = "/login/user", method = RequestMethod.POST)
    public ResponseEntity<?> login(final @RequestHeader(value = AUTHORIZATION) String authHeader) {
        if (authHeader == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (!authHeader.startsWith(BASIC)) {
            return new ResponseEntity<>("Incorrect Auth Scheme", HttpStatus.BAD_REQUEST);
        }

        try {
            final String encodedAuthValue = authHeader.substring(BASIC.length());
            final byte[] decoded = Base64.getDecoder().decode(encodedAuthValue);
            final String[] authValue = new String(decoded, "UTF-8").split(":");

            if (authValue.length != 2) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            final String username = authValue[0];
            final String password = authValue[1];
            try {
                final Credentials credentials = authenticateOperation.execute(username, password, UserPrincipal.Role.USER);

                if (credentials == null) {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
                return new ResponseEntity<>(credentials, HttpStatus.OK);

            } catch (NonUniqueResultException e) {
                LOG.error("LoginController failed because email duplication is found for " + username);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (UnsupportedEncodingException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
