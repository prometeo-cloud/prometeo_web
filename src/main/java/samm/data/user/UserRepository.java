package samm.data.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import samm.data.RepositoryObjectFactory;
import samm.domain.user.model.User;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static samm.infrastructure.security.authentication.UserPrincipal.Role;

@Named
@Singleton
public class UserRepository {
    private static final Logger LOG = LoggerFactory.getLogger(UserRepository.class);

    private final RepositoryObjectFactory repositoryObjectFactory;

    @PersistenceContext
    private EntityManager em;

    @Inject
    public UserRepository(RepositoryObjectFactory repositoryObjectFactory) {
        this.repositoryObjectFactory = repositoryObjectFactory;
    }

    public User set(User user) {
        final UserEntity newUserEntity = repositoryObjectFactory.createEntity(user, UserEntity.class);
        em.persist(newUserEntity);

        final Integer id = (Integer) em.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(newUserEntity);
        user.setId(id);

        return repositoryObjectFactory.createBusinessObject(newUserEntity, User.class);
    }

    public User get(Integer userId) {
        final UserEntity userEntity = em.find(UserEntity.class, userId);
        return repositoryObjectFactory.createBusinessObject(userEntity, User.class);
    }

    public List<User> getAll() {
        final List<UserEntity> userEntities = em.createNamedQuery(UserEntity.FIND_ALL).getResultList();
        final List<User> users = new ArrayList<>();

        userEntities.forEach(
            userEntity -> users.add(repositoryObjectFactory.createBusinessObject(userEntity, User.class)));

        return users;
    }

    public void update(User user) {
        final UserEntity userEntityToUpdate = em.find(UserEntity.class, user.getId());
        userEntityToUpdate.setEmail(user.getEmail());
        userEntityToUpdate.setForename(user.getForename());
        userEntityToUpdate.setPassword(user.getPassword());
        userEntityToUpdate.setSurname(user.getSurname());
        userEntityToUpdate.setJobTitle(user.getJobTitle());
        userEntityToUpdate.setBaseSite(user.getBaseSite());
        userEntityToUpdate.setPhone(user.getPhone());
        userEntityToUpdate.setRole(user.getRole());

        em.merge(userEntityToUpdate);
        em.flush();
        em.refresh(userEntityToUpdate);
    }

    public void remove(User user) {
        final UserEntity userToRemove = em.getReference(UserEntity.class, user.getId());
        em.remove(userToRemove);
    }

    public User findUserByEmail(String email, Role role) {
        final Query query = em.createNamedQuery(UserEntity.FIND_BY_EMAIL);
        query.setParameter(UserEntity.EMAIL_PARAM, email);
        query.setParameter(UserEntity.ROLE_PARAM, role.name().toUpperCase());
        final List<UserEntity> result = query.getResultList();

        if (result.size() > 1) {
            LOG.error("Duplicate user found for " + email + ".  Expected to be unique");
            throw new NonUniqueResultException();
        } else if (result.size() == 0) {
            LOG.debug("Cannot find user with " + email);
            return null;
        } else {
            return repositoryObjectFactory.createBusinessObject(result.get(0), User.class);
        }
    }

    public void activate(User user) {
        final UserEntity userEntity = em.find(UserEntity.class, user.getId());

        userEntity.setActivationDate(new Date());
        em.merge(userEntity);
    }
}