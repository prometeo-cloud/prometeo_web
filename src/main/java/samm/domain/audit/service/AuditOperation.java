package samm.domain.audit.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import samm.domain.audit.model.AuditInfo;

import javax.inject.Named;
import javax.inject.Singleton;

@Singleton
@Named
public class AuditOperation {

    public enum LEVEL {UNRECOVERABLE, SEVERE, ERROR, WARNING, AUDIT, INFO, CONFIG}

    private static final Logger LOG = LoggerFactory.getLogger(AuditOperation.class);

    public ResponseEntity<?> execute(final AuditInfo auditInfo, final String email) {

        final LEVEL level = auditInfo.getLevel();
        final String message = auditInfo.getMessage();
        final String logMessage = "[" + level + "]" + "[" + email + "] " + message;

        if (level.equals(LEVEL.UNRECOVERABLE) || level.equals(LEVEL.SEVERE) || level.equals(LEVEL.ERROR)) {
            LOG.error(logMessage);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
