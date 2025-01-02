pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "syedarsalanalirehan/xp_game"
        DOCKER_TAG = "latest"
        DOCKER_REGISTRY_CREDENTIALS = 'a8506ee7-c1d1-4b2b-8bf8-06121c8218a6'
        STAGING_SERVER = "13.127.252.71" // IP only for HTTP checks
        SSH_USER = "ec2-user"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    sh "npm install"
                   // sh "npm test" // Ensure tests are defined in package.json
                }
            }
        }

        stage('Push Docker Image to Registry') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_REGISTRY_CREDENTIALS) {
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
        }

        stage('Installing Docker on Staging Server') {
            steps {
                sshagent(['ssh-credentials-id']) { // Replace with your Jenkins SSH credentials ID
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_USER}@${STAGING_SERVER} << EOF
                    sudo yum install -y docker
                    sudo systemctl start docker
                    sudo systemctl enable docker
                    sudo usermod -aG docker ${SSH_USER}
                    EOF
                    """
                }
            }
        }

        stage('Pulling Docker Image and Running Container') {
            steps {
                sshagent(['ssh-credentials-id']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_USER}@${STAGING_SERVER} << EOF
                    docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker stop staging-container || true
                    docker rm staging-container || true
                    docker run -d --name staging-container -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    EOF
                    """
                }
            }
        }

        stage('Post-Deployment Health Check') {
            steps {
                script {
                    retry(3) { // Retry for transient issues
                        sleep(5)
                        def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://${STAGING_SERVER}:3000", returnStdout: true)
                        if (response.trim() != "200") {
                            error "Health check failed: App is not reachable!"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
