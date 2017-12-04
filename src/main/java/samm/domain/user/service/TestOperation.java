package samm.domain.user.service;

import org.springframework.security.access.prepost.PreAuthorize;

import javax.inject.Named;
import javax.inject.Singleton;

@Named
@Singleton
@PreAuthorize("hasRole('USER')")
public class TestOperation {

    public TestOperation() {
    }

    public String execute() {
        return "hello Bob - it is alive really alive.......";
    }
}
