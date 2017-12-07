# prometeo_web

## Description:

This application is a simple WEB UI frontend for prometeo.  It currently only support /run/cfg.

## Behaviour
**Feature:** Run project configuration  
As a System Administrator  
I want to be able to run a configuration for a project  
So that the relevant set up is ready for my project  

## Running:
prometeo_web is a spring boot appication and can be started via java -jar [prometeo_web].jar where [prometeo_web] is the name of the prometeo_web application jar.

## Configuration:

- http port: 8080
- Access URL: http://[prometeo_web_host]:[port] where is the DNS host name or IP address where the prometeo_web application is running 

This application requires the following environment variables to be set on the target host or container before run:

### Environment Variables

The following is a list of env variables used by this role.

| Variable  | Description  | Default  |
|---|---|---|
|ADMIN_USER|The username for the administrator|admin|
|ADMIN_PASSWORD|Password for the administrator user||
|PROMETEO_URL|The fully qualified URL where PROMETEO is hosted ||
|PROMETEO_AUTH|PROMETEO access string||

```