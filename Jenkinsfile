pipeline {
    environment {
        APP_VERSION = ""
    }
    agent none
    options { skipDefaultCheckout() }

    stages { 
        stage("Init"){
            agent any
            steps{
                script {
                    sh "oc version"
                    sh "oc whoami"
                }
            }
        }

        stage('Create Image Builder Prometeoweb') {
            when {
                expression {
                    openshift.withCluster() {
                        return !openshift.selector("bc", "prometeoweb").exists();
                    }
                }
            }
            agent any
            steps {
                script {
                    openshift.withCluster() {
                        openshift.newBuild("--name=prometeoweb", "--image-stream=java:latest", "--binary")
                    }
                }
            }
        }

        stage("Maven build") {
            agent { label 'maven' }
            steps {
                script {
                        checkout scm

                        def pom = readMavenPom file: "pom.xml"
                        sh "mvn clean package -DskipTests"
                        APP_VERSION = pom.version
                        artifactId = pom.artifactId
                        groupId = pom.groupId.replace(".", "/")
                        packaging = pom.packaging
                        NEXUS_ARTIFACT_PATH = "${groupId}/${artifactId}/${APP_VERSION}/${artifactId}-${APP_VERSION}.${packaging}"
                        echo "Building container image with artifact = ${NEXUS_ARTIFACT_PATH}"

                        // This is here until we get the Nexus repo setup
                        openshift.withCluster() {
                            openshift.selector("bc", "prometeoweb").startBuild("--from-file=target/${artifactId}-${APP_VERSION}.${packaging}", "--wait")
                        }
                    }
                }
        }
        

        // stage('Build Application Image') {
        //     agent { label 'maven' }
        //     steps {
        //         script {
        //             openshift.withCluster() {
        //                 openshift.selector("bc", "prometeoweb").startBuild("--from-file=target/${artifactId}-${APP_VERSION}.${packaging}", "--wait")
        //             }
        //         }
        //     }
        // }

        stage('Dev Deployment') {
            agent any
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    input 'Do you approve prometeoweb deployment into DEV environment?'
                }
            }
        }

        stage('Promote to DEV') {
            agent any
            steps {
                script {
                openshift.withCluster() {
                    openshift.tag("prometeoweb:latest", "prometeoweb:dev")
                    }
                }
            }
        }

        stage('Create app if not already there') {
            agent any
            when {
                expression {
                    openshift.withCluster() {
                        return !openshift.selector("dc", "prometeoweb-dev").exists();
                    }
                }
            }
            steps {
                 script {
                    openshift.withCluster() {
                        openshift.newApp("prometeoweb:dev", "--name=prometeoweb-dev","-l version=${APP_VERSION}").narrow('svc').expose()
                        openshift.selector( 'deploymentconfig/prometeoweb-dev' ).describe()
                        openshift.raw('set','triggers','dc/prometeoweb-dev', '--manual')
                        openshift.raw('env','dc/prometeoweb-dev','ADMIN_PASSWORD=test','PROMETEO_AUTHORIZATION=test','PROMETEO_URL=http://prometeo-dev:8080')
                        openshift.raw('set','triggers','dc/prometeoweb-dev', '--auto')
                    }

                    // sh "oc whoami"
                    // sh "oc get dc --show-labels=true"
                    // sh "oc set triggers dc/prometeoweb-dev --manual"
                    // sh "oc env dc/prometeoweb-dev ADMIN_PASSWORD=test PROMETEO_AUTHORIZATION=test PROMETEO_URL=http://prometeo-dev:8080"
                    // sh "oc set triggers dc/prometeoweb-dev --auto"
                }
            }
        }
    }
}        