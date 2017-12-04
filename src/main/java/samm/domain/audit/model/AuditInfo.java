package samm.domain.audit.model;

import samm.domain.audit.service.AuditOperation;

public class AuditInfo {

    private AuditOperation.LEVEL level;
    private String message;

    public AuditOperation.LEVEL getLevel() {
        return level;
    }

    public void setLevel(AuditOperation.LEVEL level) {
        this.level = level;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
