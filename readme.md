# efk_install_application

## Description:

Install EFK application

## Behaviour

**Feature:** Install EFK
As a System Administrator
I want to ensure that EFK is installed
So that I can collect and collate logs for the customer

**Scenario:** Pulls fluentd base docker image if it does not exists  in the local docker registry

- **Given** a valid fluentd docker images does not exist in the local registry
- **Given** the location of a Docker registry containing fluentd is known
- **Given** the secrets to log into the Docker registry are known if required
- **When** the installation is requested
- **Then** the fluentd image is pulled into the local registry

**Scenario:** Prepare fluentd Dockerfile to include elasticsearch plugin

- **Given** a valid Dockerfile exists
- **When** the installation is requested
- **Then** a new custom fluentd docker image is built with the elasticesearch plugin installed

**Scenario:** Configure fluentd

- **Given** that fluentd host is known
- **Given** a valid fluentd configuration file is available
- **When** the installation is requested
- **Then** the fluentd configuration is copied to the fluentd host

**Scenario:** Pulls kibana base docker image if it does not exists  in the local docker registry

- **Given** a valid kibana docker images does not exist in the local registry
- **Given** the location of a Docker registry containing kibana is known if required
- **Given** the secrets to log into the Docker registry are known
- **When** the installation is requested
- **Then** the kibana image is pulled into the local registry

**Scenario:** Pulls elasticsearch base docker image if it does not exists  in the local docker registry

- **Given** a valid elasticsearch docker images does not exist in the local registry
- **Given** the location of a Docker registry containing elasticsearch is known
- **Given** the secrets to log into the Docker registry are known if required
- **When** the installation is requested
- **Then** the elasticsearch image is pulled into the local registry

**Scenario:** Start EFK sevices

- **Given** a valid fluentd docker image with the elasticesearch plugin is present
- **Given** a valid kibana docker image is present
- **Given** a valid elasticesearch docker image is present
- **When** the installation is requested
- **Then** the EFK services are started

## Configuration:



### Default variables

The following is a list of default variables used by this role.

| Variable  | Description  | Default  |
|---|---|---|
|fluentd_registry_login|Whether to enable Docker registry login for secure registries|false|
|fluentd_registry|The name of the docker registry host use to pull the fluentd docker image|docker.io|
|fluentd_image_name|---|fluent/fluentd:v0.12-debian|
|fluentd_port|The listening port for fluentd|24224|
|fluentd_host_dir|Directiry on the host where fluentd maps its configuration directory|/etc/fluentd|
|fluentd_conf_dir|The internal configuration directory within the container. **Do not change** unless it is a requirement for future fluentd releases|/fluentd/etc|
|elasticsearch_registry_login|Whether to enable Docker registry login for secure registries|false|
|elasticsearch_registry|The name of the docker registry host use to pull the elasticsearch docker image|docker.io|
|elasticsearch_image_name|---|elasticsearch|
|elasticsearch_host|Host name for elasticsearch|elasticsearch|
|elasticsearch_port|Listening port for elasticsearch|24224|
|kibana_registry_login|Whether to enable Docker registry login for secure registries|false|
|kibana_registry|The name of the docker registry host use to pull the kibana docker image|docker.io|
|kibana_image_name|---|elasticsearch|
|kibana_port|Listening port for kibana|5601|

## Testing:

![Testing Configuration](docs/testing.png "Testing Configuration")

The diagram above shows a simple testing configuration using a apache container installed with the following docker-compose file to spin up an Apache container.  You should do this on the EFK host otherwise change the fluentd address to suit.

Any logs from Apache will be forwarded to fluentd which in turn will write to the elasticesearch engine.  Logs can be generated on the apache server by accessing it via browser (http://efkhost) or curl.

To verify, go to http://efkhost:5601/ with your browser. Then, you need to set up the index name pattern for Kibana where efkhost is where EFK is running. Please specify fluentd-* to Index name or pattern and press Create button (see https://docs.fluentd.org/v0.12/articles/docker-logging-efk-compose)

``` 
version: '2'
services:
  web:
    image: httpd
    ports:
      - "80:80"
    logging:
      driver: "fluentd"
      options:
        fluentd-address: localhost:24224
        tag: httpd.access
```