package samm.data.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import samm.infrastructure.security.authentication.UserPrincipal;

import javax.inject.Named;
import javax.inject.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Named
@Singleton
public class WhiteListRepository {

    private static final Logger LOG = LoggerFactory.getLogger(WhiteListRepository.class);

    @PersistenceContext
    private EntityManager em;

    public WhiteListRepository() {
    }

    public boolean emailWhiteListed(String email, UserPrincipal.Role role) {
        final Query query = em.createNamedQuery(WhiteListEntity.FIND_BY_EMAIL);
        query.setParameter(WhiteListEntity.EMAIL_PARAM, email.toLowerCase());
        query.setParameter(WhiteListEntity.ROLE_PARAM, role.name().toUpperCase());

        final List<WhiteListEntity> result = query.getResultList();

        return result.size() > 0;
    }
}
