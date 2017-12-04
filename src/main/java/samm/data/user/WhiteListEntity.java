package samm.data.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;


@Table(name = "white_list")
@Entity
@NamedQueries({
    @NamedQuery(name = WhiteListEntity.FIND_BY_EMAIL, query = "SELECT W FROM WhiteListEntity W WHERE W.email = :email AND W.role = :role")
})
public class WhiteListEntity implements Serializable {
    public static final String FIND_BY_EMAIL = "WhiteListEntity.FIND_BY_EMAIL";
    public static final String EMAIL_PARAM = "email";
    public static final String ROLE_PARAM = "role";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WhiteListEntity that = (WhiteListEntity) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(email, that.email) &&
               Objects.equals(role, that.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, role);
    }
}
