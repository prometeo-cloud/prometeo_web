package org.gatblau.prometeo.web.domain.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import javax.inject.Named;
import javax.inject.Singleton;

@Named
@Singleton
public class CommandOperation {

    @Value("${PROMETEO_URL:}")
    private String prometeoUrl;

    public String createProject(final String projectName) {
        final String yamlToSend = projectName;

        try {
            final RestTemplate restTemplate = new RestTemplate();
            final HttpEntity requestEntity = new HttpEntity(yamlToSend, authorizationHeaders());
            // String.class should be the model that comes back from prometeo
            return restTemplate.exchange(prometeoUrl, HttpMethod.POST, requestEntity, String.class).getBody();

        } catch (Exception e) {
            throw new RuntimeException("Problem executing command because of " + e.getMessage(), e);
        }
    }

    private HttpHeaders authorizationHeaders() {
        final HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "");
        return headers;
    }
}
