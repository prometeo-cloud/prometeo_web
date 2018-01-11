pipeline {
    environment {
        APP_VERSION = ""
    }
    agent none
    options {
        skipDefaultCheckout()
    }

    stages {
        stage("Init") {
            agent any
            steps {
                script {
                    sh "oc version"
                }
            }
        }

        stage('Create Image Builder Prometeoweb') {
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            return !openshift.selector("bc", "prometeoweb").exists();
                        }
                    }
                }
            }
            agent any
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            openshift.newBuild("--name=prometeoweb", "--image-stream=prometeo-dev/java:latest", "--binary")
                        }
                    }
                }
            }
        }

        stage("Maven build") {
            agent {
                label 'maven'
            }
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
                        openshift.withProject('prometeo-dev') {
                            openshift.selector("bc", "prometeoweb").startBuild("--from-file=target/${artifactId}-${APP_VERSION}.${packaging}", "--wait")
                        }
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
                    input 'Deploy into DEV environment?'
                }
            }
        }

        stage('Promote to DEV') {
            agent any
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            openshift.tag("prometeoweb:latest", "prometeoweb:dev")
                        }
                    }
                }
            }
        }

        stage('Create app in DEV if not already there') {
            agent any
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            return !openshift.selector("dc", "prometeoweb").exists();
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            openshift.newApp("prometeoweb:dev", "--name=prometeoweb", "-l version=${APP_VERSION}").narrow('svc').expose()
                            openshift.raw('set', 'triggers', 'deploymentconfig/prometeoweb', '--manual')
                            openshift.raw('env', 'deploymentconfig/prometeoweb', 'ADMIN_PASSWORD=test', 'PROMETEO_AUTHORIZATION=test', 'PROMETEO_URL=http://prometeo:8080')
                            openshift.raw('set', 'triggers', 'deploymentconfig/prometeoweb', '--auto')
                        }
                    }
                }
            }
        }



        stage('Test Deployment') {
            agent any
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    input 'Do you approve deployment to Test environment ?'
                }
            }
        }

        stage('Promote to TEST') {
            agent any
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-dev') {
                            openshift.tag("prometeoweb:dev", "prometeoweb:test")
                        }
                    }
                }
            }
        }

        stage('Create app in TEST if not already there') {
            agent any
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-test') {
                            return !openshift.selector("dc", "prometeoweb").exists();
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject('prometeo-test') {
                            openshift.newApp("prometeo-dev/prometeoweb:test", "--name=prometeoweb").narrow('svc')
                            openshift.raw('set', 'triggers', 'deploymentconfig/prometeoweb', '--manual')
                            openshift.raw('env', 'dc/prometeoweb ADMIN_PASSWORD=test PROMETEO_AUTHORIZATION=test PROMETEO_URL=http://prometeo')
                            openshift.raw('set', 'triggers', 'deploymentconfig/prometeoweb', '--auto')
                        }
                    }
                }
            }
        }
    }
}