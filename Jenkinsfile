pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                // Checkout the repository
                git 'https://github.com/maureenbianca/ansible.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                // Run unit tests
                sh 'npm test'
            }
        }
    }
    
    post {
        success {
            // Send success notification if all stages pass
            echo 'All tests passed!'
        }
        failure {
            // Send failure notification if any stage fails
            echo 'Tests failed!'
        }
    }
}
