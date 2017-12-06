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