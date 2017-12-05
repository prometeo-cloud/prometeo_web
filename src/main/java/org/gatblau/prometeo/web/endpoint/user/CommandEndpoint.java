package org.gatblau.prometeo.web.endpoint.user;

import org.springframework.web.bind.annotation.*;
import org.gatblau.prometeo.web.domain.user.service.CommandOperation;

import javax.inject.Inject;

@RestController
public class CommandEndpoint {

    private final CommandOperation commandOperation;

    @Inject
    public CommandEndpoint(final CommandOperation commandOperation) {
        this.commandOperation = commandOperation;
    }

    @RequestMapping(value = "/project", method = RequestMethod.POST)
    public String createProject(@RequestBody(required = true) final String project) {
        return commandOperation.createProject(project);
    }
}
