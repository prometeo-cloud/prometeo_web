package samm.endpoint;

import org.springframework.security.access.prepost.PreAuthorize;
import samm.domain.user.service.AuthenticateOperation;
import samm.domain.user.service.TestOperation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import javax.inject.Inject;
import javax.transaction.Transactional;

@RestController
public class TestEndpoint {

    private final TestOperation testOperation;
    private final AuthenticateOperation authenticateOperation;

    @Inject
    public TestEndpoint(TestOperation testOperation, AuthenticateOperation authenticateOperation) {
        this.testOperation = testOperation;
        this.authenticateOperation = authenticateOperation;
    };

    @Transactional
    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    @PreAuthorize(value="hasRole('USER')")
    public String test() {
        return testOperation.execute();
    }
}
