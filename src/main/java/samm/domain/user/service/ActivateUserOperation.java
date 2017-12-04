package samm.domain.user.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import samm.data.user.UserRepository;
import samm.domain.user.model.User;
import samm.infrastructure.security.authentication.UserPrincipal;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

@Singleton
@Named
public class ActivateUserOperation {
    private final UserRepository userRepository;

    @Inject
    public ActivateUserOperation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> execute(final UserPrincipal principal) {
        final Integer userId = new Integer(principal.getSubject());
        final User user = userRepository.get(userId);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
        } else if (user.getActivationDate() != null) {
            return new ResponseEntity<>("User is already activated", HttpStatus.CONFLICT);
        } else {
            userRepository.activate(user);
            return (new ResponseEntity<>(HttpStatus.OK));
        }
    }
}
