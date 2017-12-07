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
    // define maven with custom settings.xml (using this path as convention.. define a env var if desired...)
    // def mvnCmd = "mvn -s ${WORKSPACE}/cicd/maven/settings.xml"

    stage("Maven build") {

        dir('app') {
            // Get source code from repository
            git "${params.APP_GIT_URL}"
            // extract info from pom.xml
            def pom = readMavenPom file: "pom.xml"
            sh "mvn clean package -DskipTests"
            // stash application template
            // stash name: "app-template", includes: "${params.APP_TEMPLATE}"
        }
    }
}