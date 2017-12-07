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
        dir('app') {
            // Get source code from repository
            git "${params.APP_GIT_URL}"
            // extract info from pom.xml
            def pom = readMavenPom file: "pom.xml"
            sh "mvn clean package -DskipTests; ls -latr target"   
 
            // global variable
            APP_VERSION = pom.version
            artifactId = pom.artifactId
            groupId = pom.groupId.replace(".", "/")
            packaging = pom.packaging
            NEXUS_ARTIFACT_PATH = "${groupId}/${artifactId}/${APP_VERSION}/${artifactId}-${APP_VERSION}.${packaging}"  
            echo "Artifact = ${NEXUS_ARTIFACT_PATH}"       
        }
    }

    stage("Openshift Image build"){
        openshift.withCluster() {

            echo "Starting binary build in project ${openshift.project()} for application ${NEXUS_ARTIFACT_PATH}"
            // openshift.withProject() {
                echo "Using file ${artifactId}-${APP_VERSION}.${packaging} in build"
                def buildartifact=${artifactId}-${APP_VERSION}.${packaging}

            def build = openshift.startBuild("prometeoweb", "--from-file=/target${buildartifact}")
            build.describe()
            if (watchUntilCompletion) {
                echo "user has requested to wait until build has finished"
                build.watch {
                    return it.object().status.phase == "Complete"
                }
            }
            // }
        }
    }
}

        