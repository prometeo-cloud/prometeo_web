package org.gatblau.prometeo.web.domain.user.model;

import java.util.Objects;

import static org.gatblau.prometeo.web.infrastructure.security.authentication.UserPrincipal.Role;

public class User {
    private String email;
    private String forename;
    private String surname;
    private String password;
    private String jobTitle;
    private String baseSite;
    private String phone;
    private Role role;

    private Integer id;

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

    public String getForename() {
        return forename;
    }

    public void setForename(String forename) {
        this.forename = forename;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getBaseSite() {
        return baseSite;
    }

    public void setBaseSite(String baseSite) {
        this.baseSite = baseSite;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public void setRole(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(email, user.email) &&
                Objects.equals(forename, user.forename) &&
                Objects.equals(surname, user.surname) &&
                Objects.equals(password, user.password) &&
                Objects.equals(jobTitle, user.jobTitle) &&
                Objects.equals(baseSite, user.baseSite) &&
                Objects.equals(phone, user.phone) &&
                role == user.role &&
                Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, forename, surname, password, jobTitle, baseSite, phone, role, id);
    }
}
