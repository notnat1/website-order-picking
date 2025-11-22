pipeline {
    agent any

    environment {
        APP_PATH = '/opt/website-order-picking'
        MYSQL_ROOT_PASSWORD_JENKINS = credentials('MYSQL_ROOT_PASSWORD')
        MYSQL_DATABASE_JENKINS = credentials('MYSQL_DATABASE')
        MYSQL_USER_JENKINS = credentials('MYSQL_USER')
        MYSQL_PASSWORD_JENKINS = credentials('MYSQL_PASSWORD')
        JWT_SECRET_JENKINS = credentials('JWT_SECRET')
    }

    stages {
        stage('Checkout Code and Prepare Directory') {
            steps {
                script {
                    sh 'sudo rm -rf /opt/website-order-picking/*'
                    sh 'sudo mkdir -p /opt/website-order-picking'
                    sh 'sudo chown -R jenkins:jenkins /opt/website-order-picking'
                    checkout scm
                    sh 'sudo cp -R . /opt/website-order-picking'
                }
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASSWORD_JENKINS'),
                                    string(credentialsId: 'MYSQL_DATABASE', variable: 'MYSQL_DATABASE_JENKINS'),
                                    string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER_JENKINS'),
                                    string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD_JENKINS'),
                                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET_JENKINS')]) {
                        sh '''
                          echo "MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD_JENKINS}" > /opt/website-order-picking/.env
                          echo "MYSQL_DATABASE=${MYSQL_DATABASE_JENKINS}" >> /opt/website-order-picking/.env
                          echo "MYSQL_USER=${MYSQL_USER_JENKINS}" >> /opt/website-order-picking/.env
                          echo "MYSQL_PASSWORD=${MYSQL_PASSWORD_JENKINS}" >> /opt/website-order-picking/.env
                          echo "JWT_SECRET=${JWT_SECRET_JENKINS}" >> /opt/website-order-picking/.env
                          echo "VITE_API_BASE_URL=/api" >> /opt/website-order-picking/.env
                        '''
                    }
                    sh 'sudo docker-compose --project-directory /opt/website-order-picking -f /opt/website-order-picking/docker-compose.yml down --remove-orphans --volumes'
                    sh 'sudo docker-compose --project-directory /opt/website-order-picking -f /opt/website-order-picking/docker-compose.yml up --build --force-recreate -d'
                }
            }
        }

        stage('Run Database Migrations') {
            steps {
                script {
                    sh 'sudo docker-compose --project-directory /opt/website-order-picking -f /opt/website-order-picking/docker-compose.yml exec -T backend npx prisma migrate deploy'
                }
            }
        }

        stage('Seed Database') {
            steps {
                script {
                    sh 'sudo docker-compose --project-directory /opt/website-order-picking -f /opt/website-order-picking/docker-compose.yml exec -T backend npx prisma db seed'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh 'sudo docker-compose --project-directory /opt/website-order-picking -f /opt/website-order-picking/docker-compose.yml ps'
                }
            }
        }
    }

    post {
        failure {
            echo 'Docker Compose Deployment failed! Check logs in Jenkins and on the VPS.'
        }
        success {
            echo 'Deployment completed successfully!'
        }
    }
}

