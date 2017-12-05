package org.gatblau.prometeo.web.endpoint.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.gatblau.prometeo.web.domain.audit.model.AuditInfo;
import org.gatblau.prometeo.web.domain.audit.service.AuditOperation;

import javax.inject.Inject;

@RestController
public class AuditEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(AuditEndpoint.class);
    private final AuditOperation auditOperation;

    @Inject
    public AuditEndpoint(AuditOperation auditService) {
        this.auditOperation = auditService;
    }

    @RequestMapping(value = "/audit", method = RequestMethod.POST)
    public ResponseEntity<?> log(@RequestBody AuditInfo auditInfo) {
        final String email = "TODO";
        return auditOperation.log(auditInfo, email);
    }
}
