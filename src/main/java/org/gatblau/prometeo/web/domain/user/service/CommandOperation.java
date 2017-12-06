package org.gatblau.prometeo.web.domain.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import javax.inject.Named;
import javax.inject.Singleton;

@Named
@Singleton
public class CommandOperation {
    @Value("${PROMETEO_URL}")
    private String PROMETEO_URL;

    @Value("${PROMETEO_AUTHORIZATION}")
    private String PROMETEO_AUTH;

    public String createProject(final String yaml) {
        // TODO - Clean up string, needs to investigate why JS String is not formatted
        final String yamlToSend =
                yaml.substring(1, yaml.length()-1)
                .replace("\\n", System.lineSeparator())
                .replace("\\\"", "\"");
        try {
            final RestTemplate restTemplate = new RestTemplate();
            final HttpEntity<String> requestEntity = new HttpEntity<>(yamlToSend, authorizationHeaders());

            // String.class should be the model that comes back from prometeo
            final String result = restTemplate.exchange(PROMETEO_URL + "/run/cfg", HttpMethod.POST, requestEntity, String.class).getBody();

            // change String to JSON - TODO prometeo should return JSON
            return "{ " + result.replace("ProcessId: ", "\"ProcessId\": \"") + "\" }";
        } catch (HttpStatusCodeException e) {
            System.err.println("ERROR:" + System.lineSeparator() + e.getMessage());
            throw new RuntimeException("Problem executing command because of " + e.getMessage(), e);
        }
    }

    private HttpHeaders authorizationHeaders() {
        final HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", PROMETEO_AUTH);
        headers.add("Content-Type", "application/x-yaml");
        return headers;
    }
}
