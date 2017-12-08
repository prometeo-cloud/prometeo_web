node("maven") {

    // download and configure all common cicd stuff		 
    dir('cicd') {
        // download all cicd required files		
        // git "${params.CICD_GIT_URL}"
        // load openshift-utils functions (using this path as convention.. define a env var if desired...)		
        // openshiftUtils = load 'pipeline/functions/openshift-utils.groovy'
        // load groovy functions		
        // newman = load 'pipeline/functions/newman.groovy'

    }

    stage("Maven build") {
            // Get source code from repository
            git "${params.APP_GIT_URL}"

            // extract info from pom.xml
            def pom = readMavenPom file: "pom.xml"

            sh "mvn clean package -DskipTests"   
 
            // global variable
            APP_VERSION = pom.version
            artifactId = pom.artifactId
            groupId = pom.groupId.replace(".", "/")
            packaging = pom.packaging
            NEXUS_ARTIFACT_PATH = "${groupId}/${artifactId}/${APP_VERSION}/${artifactId}-${APP_VERSION}.${packaging}"  
            echo "Artifact = ${NEXUS_ARTIFACT_PATH}"   
            // OSE_TAG=${artifactId}-${APP_VERSION}    
    }

    stage("Openshift Image build"){
        openshift.withCluster() {
            echo "Starting binary build in project ${openshift.project()} for application ${NEXUS_ARTIFACT_PATH}"
            openshift.withProject() {
                def buildartifact="${artifactId}-${APP_VERSION}.${packaging}"
                echo "Using file ${buildartifact} in build"

                def build = openshift.startBuild("prometeoweb", "--from-file=./target/${buildartifact}")
                build.describe()
                build.watch {
                    return it.object().status.phase == "Complete"
                }
                // openshift.tag("prometeoapp:latest","prometeoapp:${OSE_TAG}")
        //         def images = openshift.selector("imagestream")
        //         images.withEach { // The closure body will be executed once for each selected object.
        // // The 'it' variable will be bound to a Selector which selects a single
        // // object which is the focus of the iteration.
        //             echo "Images: ${it.name()} is defined in ${openshift.project()}"
        //         }
            }
        }
    }
}

node(){
    stage("Openshift Image promotion"){
        openshift.withCluster() {
            echo "Starting tag project ${openshift.project()}"
            openshift.withProject() {
                openshift.tag("prometeoapp:latest","prometeoapp:currtest")
            }


            openshift.withProject("test-project") {
            if (openshift.selector('dc', 'prometeoapp').exists()) {
                openshift.selector('dc', 'prometeoapp').delete()
                openshift.selector('svc', 'prometeoapp').delete()
                openshift.selector('route', 'prometeoapp').delete()
                }
                openshift.newApp("prometeoapp:${currtest}").narrow("svc").expose()
            }
        }
    }
}

        