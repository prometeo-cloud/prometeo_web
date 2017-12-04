package samm.endpoint.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import samm.domain.user.service.ActivateUserOperation;
import samm.infrastructure.security.authentication.Token;
import samm.infrastructure.security.authentication.UserPrincipal;
import samm.infrastructure.security.authentication.UserAuthenticator;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

@RestController
public class ActivateEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(ActivateEndpoint.class);

    private final ActivateUserOperation activateUserOperation;
    private final UserAuthenticator authenticator;

    @Inject
    public ActivateEndpoint(ActivateUserOperation activateUserOperation,
                            UserAuthenticator authenticator) {
        this.activateUserOperation = activateUserOperation;
        this.authenticator = authenticator;
    }

    @Transactional
    @RequestMapping(value = "/activate/{key}/user", method = RequestMethod.GET)
    public ResponseEntity<?> activate(@PathVariable("key") final String activateString,
                                      final HttpServletRequest request, final HttpServletResponse httpServletResponse) {

        final UserPrincipal userPrincipal = authenticator.validateToken(activateString);

        if (userPrincipal.getTokenStatus() == Token.Status.VALID
            && userPrincipal.getClaims().get("type").equals(Token.Type.ACTIVATE.toString())) {

            final ResponseEntity result = activateUserOperation.execute(userPrincipal);
            if (result.getStatusCode() == HttpStatus.OK) {
                final StringBuffer url = request.getRequestURL();
                final String uri = request.getRequestURI();
                final String ctx = request.getContextPath();
                final String baseUrl = url.substring(0, url.length() - uri.length() + ctx.length()) + "/";

                httpServletResponse.setHeader("Location", baseUrl + "/#/user/activated");
                return new ResponseEntity<>(HttpStatus.PERMANENT_REDIRECT);
            } else {
                return result;
            }
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
