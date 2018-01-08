# Prometeo Web Application

## Build instructions

### Create Binary build
```
oc new-build  -i prometeo --binary=true --to=prometeoweb --strategy=source
```

### Build the application
```
mvn clean package
```

### Perform a binary build
```
oc start-build prometeoweb --from-file=./target/prometeo_web-0.0.1-SNAPSHOT.jar --follow
```

### Create the OSE Application
```
oc new-app prometeoweb
```

### Set the requisite environment variables 
```
oc env dc/prometeoweb ADMIN_PASSWORD=test PROMETEO_AUTHORIZATION=test PROMETEO_URL=http://prometeoapp-myproject.192.168.99.104.nip.io
```

*Note* Passwords should be configured via secrets

### Expose the service
```
oc expose svc prometeoweb
```


## Jenkins

Install an ephemeral jenkins instance in the project

### Create a build
```
oc new-build --env="APP_GIT_URL=https://github.com/noelo/prometeo_web.git" https://github.com/noelo/prometeo_web --strategy=pipeline --name=prometeo-web-pipeline
```

### Patch the BC to add the proper GIT repo

*Note* This will be replaced eventually when the web hooks are available
```
oc patch bc prometeo-web-pipeline -p '{"spec":{"strategy":{"jenkinsPipelineStrategy":{"env": [{"name":"APP_GIT_URL","value":"https://github.com/noelo/prometeo_web"}]}}}}'
```

### Trigger the build via curl
*Note* Get the correct endpoint and secret from the BC

```
curl -X POST https://192.168.99.104:8443/apis/build.openshift.io/v1/namespaces/myproject/buildconfigs/prometeo-web-pipeline/webhooks/b0Lr0renLAWGwPCT3VFw/generic

curl -X POST https://192.168.99.104:8443/apis/build.openshift.io/v1/namespaces/myproject/buildconfigs/prometeo-web-pipeline/webhooks/b0Lr0renLAWGwPCT3VFw/generic
```