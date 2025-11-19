// D:\kevin\website-order-picking\Jenkinsfile
pipeline {
    // Define the agent where the pipeline will run. 'any' means Jenkins will use any available agent,
    // which is typically the Jenkins controller itself for simple setups.
    agent any

    // Define environment variables that will be used throughout the pipeline.
    // Sensitive variables (like database passwords, JWT secrets) should be stored in Jenkins Credentials
    // and then injected into the build using the 'environment' block or 'withCredentials'.
    environment {
        // APP_PATH is the target directory on your VPS where the project will be deployed.
        // Ensure the Jenkins user has write permissions to this directory.
        APP_PATH = '/opt/website-order-picking'
    }

    // Stages define the different phases of your pipeline (e.g., checkout, build, deploy).
    stages {
        stage('Checkout Code and Prepare Directory') {
            steps {
                script {
                    // Clean workspace on Jenkins before cloning
                    // It's safer to clean the APP_PATH before cloning the new code
                    sh "sudo rm -rf ${APP_PATH}/* || true" // Remove contents, ignore if dir doesn't exist
                    sh "sudo mkdir -p ${APP_PATH}"        // Ensure directory exists
                    sh "sudo chown -R jenkins:jenkins ${APP_PATH}" // Ensure Jenkins owns it

                    // Use the SSH credentials configured in Jenkins
                    // 'github-inventory-app-ssh-key' is the ID given in Jenkins Credentials for this project
                    git branch: 'main', credentialsId: 'github-inventory-app-ssh-key', url: 'git@github.com:your-username/your-repo.git'

                    // Copy the cloned repository content to the deployment path on the VPS
                    // The 'current directory' here is Jenkins's workspace for this job.
                    sh "sudo cp -R . ${APP_PATH}"
                }
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                script {
                    // Navigate into the deployment directory on the VPS
                    dir("${APP_PATH}") {
                        // Securely create the .env file for Docker Compose using Jenkins secrets
                        // You MUST replace 'MYSQL_ROOT_PASSWORD_SECRET_ID', 'MYSQL_DATABASE_SECRET_ID', etc.
                        // with the actual IDs of your 'Secret text' credentials in Jenkins.
                        // For example:
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
                            echo "VITE_API_BASE_URL=/api" >> .env # Frontend API base URL
                            """
                        }


                        // Stop and remove old containers gracefully (if any running from previous deployment)
                        // '--remove-orphans' removes services not defined in the current compose file
                        sh "sudo docker-compose down --remove-orphans || true" 
                        
                        // Build new images and start services in detached mode
                        // '--build' forces rebuilding images from Dockerfiles
                        // '--force-recreate' ensures new containers are created from the new images
                        sh "sudo docker-compose up --build --force-recreate -d"
                    }
                }
            }

            stage('Run Database Migrations (if applicable)') {
                steps {
                    script {
                        dir("${APP_PATH}") { // Changed to APP_PATH, assuming docker-compose.yml is there
                            // This ensures the Prisma migrations are applied to the database
                            // assuming your 'db' service is running and accessible from the backend container
                            sh "sudo docker-compose exec backend npx prisma migrate deploy"
                        }
                    }
                }
            }

            stage('Nginx Reload (if used as reverse proxy)') {
                // This stage is only needed if Nginx on the host is proxying to your Docker services.
                // If you are exposing ports directly (e.g., 80:80 and 5001:5001) and not using Nginx on the host, you can skip this.
                steps {
                    sh "sudo systemctl reload nginx"
                }
            }
        }

        // Post-build actions (e.g., send notifications, cleanup workspace).
        post {
            success {
                echo 'Docker Compose Deployment successful!'
            }
            failure {
                echo 'Docker Compose Deployment failed! Check logs in Jenkins and on the VPS.'
            }
            always {
                // Clean up Jenkins's workspace after the build.
                // cleanWs()
            }
        }
    }
}