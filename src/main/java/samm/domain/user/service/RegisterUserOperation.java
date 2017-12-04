package samm.domain.user.service;

import org.apache.velocity.app.VelocityEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.velocity.VelocityEngineUtils;
import samm.data.user.UserRepository;
import samm.data.user.WhiteListRepository;
import samm.domain.user.model.User;
import samm.infrastructure.mail.EmailService;
import samm.infrastructure.security.authentication.Token;
import samm.infrastructure.security.authentication.UserAuthenticator;
import samm.infrastructure.security.cipher.BCryptCipher;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import java.util.HashMap;
import java.util.Map;

import static samm.infrastructure.security.authentication.UserPrincipal.Role;

@Named
@Singleton
public class RegisterUserOperation {
    private static final Logger LOG = LoggerFactory.getLogger(RegisterUserOperation.class);

    private final UserRepository repository;
    private final BCryptCipher cipher;
    private final EmailService emailService;
    private final UserAuthenticator authenticator;
    private final WhiteListRepository whiteListRepository;
    private VelocityEngine velocityEngine;

    @Inject
    public RegisterUserOperation(UserRepository repository,
                                 BCryptCipher cipher,
                                 UserAuthenticator authenticator,
                                 EmailService emailService,
                                 WhiteListRepository whiteListRepository,
                                 VelocityEngine velocityEngine) {
        this.repository = repository;
        this.cipher = cipher;
        this.emailService = emailService;
        this.authenticator = authenticator;
        this.whiteListRepository = whiteListRepository;
        this.velocityEngine = velocityEngine;
    }

    public ResponseEntity<?> execute(User user, String baseUrl) {
        if (user.getActivationDate() != null) {
            LOG.info("Attempted activation with Registration: " + user.getEmail());
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        if (!whiteListRepository.emailWhiteListed(user.getEmail(), Role.USER)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        final User existingUser = repository.findUserByEmail(user.getEmail(), Role.USER);
        if (existingUser != null) {
            LOG.info("Registration attempted with existing: " + user.getEmail());
            return new ResponseEntity<>("Account Exists", HttpStatus.CONFLICT);
        }

        user.setRole(Role.USER);
        user.setPassword(cipher.hash(user.getPassword()));
        repository.set(user);

        final Map model = new HashMap<>();
        model.put("forename", user.getForename());
        model.put("baseUrl", baseUrl);
        model.put("token", authenticator.generateJwtTokenForUser(user, Token.Type.ACTIVATE));

        final String message = VelocityEngineUtils.mergeTemplateIntoString(velocityEngine
            , "userActivation.html", "UTF-8", model);

        emailService.sendEmail(
            user.getEmail(),
            "Welcome to Atos SAMM Portal. Please activate your account",
            message);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
