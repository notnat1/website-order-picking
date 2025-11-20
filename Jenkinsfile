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

                    git branch: 'main', credentialsId: 'github-inventory-app-ssh-key', url: 'git@github.com:notnat1/website-order-picking.git'

                    sh "sudo cp -R . ${APP_PATH}"
                }
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                script {
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
                        sh "sudo mv .env ${APP_PATH}/.env"
                    }

                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml down --remove-orphans || true"
                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml up --build --force-recreate -d"
                }
            }
        }

        stage('Run Database Migrations (if applicable)') {
            steps {
                script {
                    // Resolve previously failed migrations by marking them as applied.
                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml exec backend npx prisma migrate resolve --applied 20251118081107_add_user_status_fields || true"
                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml exec backend npx prisma migrate resolve --applied 20251119081846_add_rack_to_item || true"
                    
                    // Now, deploy the migrations again. This should succeed.
                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml exec backend npx prisma migrate deploy"
                    // Run seed script to populate initial data, e.g., default admin user
                    sh "sudo docker-compose --project-directory ${APP_PATH} -f ${APP_PATH}/docker-compose.yml exec backend npx prisma db seed"
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

                echo 'Docker Compose Deployment successful!'

            }

            failure {

                echo 'Docker Compose Deployment failed! Check logs in Jenkins and on the VPS.'

            }

            always {

                cleanWs()

            }

        }

    }

    