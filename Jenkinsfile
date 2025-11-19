pipeline {
    agent any

    environment {
        APP_PATH = '/opt/website-order-picking'
    }

    stages {
        stage('Checkout Code and Prepare Directory') {
            steps {
                script {
                    sh "sudo rm -rf ${APP_PATH}/* || true"
                    sh "sudo mkdir -p ${APP_PATH}"
                    sh "sudo chown -R jenkins:jenkins ${APP_PATH}"

                    git branch: 'main', credentialsId: 'github-inventory-app-ssh-key', url: 'git@github.com:your-username/your-repo.git'

                    sh "sudo cp -R . ${APP_PATH}"
                }
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                script {
                    dir("${APP_PATH}") {
                        withCredentials([
                            string(credentialsId: 'MYSQL_ROOT_PASSWORD_SECRET_ID', variable: 'MYSQL_ROOT_PASSWORD_JENKINS'),
                            string(credentialsId: 'MYSQL_DATABASE_SECRET_ID', variable: 'MYSQL_DATABASE_JENKINS'),
                            string(credentialsId: 'MYSQL_USER_SECRET_ID', variable: 'MYSQL_USER_JENKINS'),
                            string(credentialsId: 'MYSQL_PASSWORD_SECRET_ID', variable: 'MYSQL_PASSWORD_JENKINS'),
                            string(credentialsId: 'JWT_SECRET_SECRET_ID', variable: 'JWT_SECRET_JENKINS')
                        ]) {
                            sh """
                            echo "MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD_JENKINS}" > .env
                            echo "MYSQL_DATABASE=${MYSQL_DATABASE_JENKINS}" >> .env
                            echo "MYSQL_USER=${MYSQL_USER_JENKINS}" >> .env
                            echo "MYSQL_PASSWORD=${MYSQL_PASSWORD_JENKINS}" >> .env
                            echo "JWT_SECRET=${JWT_SECRET_JENKINS}" >> .env
                            echo "VITE_API_BASE_URL=/api" >> .env
                            """
                        }

                        sh "sudo docker-compose down --remove-orphans || true" 
                        sh "sudo docker-compose up --build --force-recreate -d"
                    }
                }
            }
        }

        stage('Run Database Migrations (if applicable)') {
            steps {
                script {
                    dir("${APP_PATH}") {
                        sh "sudo docker-compose exec backend npx prisma migrate deploy"
                    }
                }
            }
        }

        stage('Nginx Reload (if used as reverse proxy)') {
            steps {
                sh "sudo systemctl reload nginx"
            }
        }
    }

    post {
        success {
            steps {
                echo 'Docker Compose Deployment successful!'
            }
        }
        failure {
            steps {
                echo 'Docker Compose Deployment failed! Check logs in Jenkins and on the VPS.'
            }
        }
        always {
            steps {
                cleanWs()
            }
        }
    }
}