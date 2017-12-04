package samm.domain.user.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import samm.data.user.UserRepository;
import samm.domain.user.model.User;
import samm.infrastructure.security.authentication.UserPrincipal;
import samm.infrastructure.security.cipher.BCryptCipher;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

@Singleton
@Named
public class ResetPasswordOperation {
    private final UserRepository repository;
    private final BCryptCipher cipher;

    @Inject
    public ResetPasswordOperation(UserRepository repository,
                                  BCryptCipher cipher) {
        this.repository = repository;
        this.cipher = cipher;
    }

    public ResponseEntity<?> execute(UserPrincipal principal, String userVerificationCode, String newPassword) {
        final String verificationCode = principal.getClaims().getId().substring(0, 8);

        if (!userVerificationCode.equals(verificationCode)) {

            System.out.println("Got here!" + verificationCode);
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final Integer userId = new Integer(principal.getSubject());
        final User user = repository.get(userId);
        user.setPassword(cipher.hash(newPassword));
        repository.update(user);
        return new ResponseEntity<>(HttpStatus.OK);

    }
}
