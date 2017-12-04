package samm.endpoint.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import samm.domain.audit.model.AuditInfo;
import samm.domain.audit.service.AuditOperation;

import javax.inject.Inject;
import javax.transaction.Transactional;

@RestController
public class AuditEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(AuditEndpoint.class);
    private final AuditOperation auditOperation;

    @Inject
    public AuditEndpoint(AuditOperation auditService) {
        this.auditOperation = auditService;
    }

    @Transactional
    @RequestMapping(value = "/audit", method = RequestMethod.POST)
    public ResponseEntity<?> log(@RequestBody AuditInfo auditInfo) {
//        final String email = (String) getUserPrincipal().getClaims().get("email"); TODO
        final String email = "TODO";
        return auditOperation.execute(auditInfo, email);
    }
}
