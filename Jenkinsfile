node {
	stage ('clone') {
		git branch: 'main', url: 'https://github.com/doughnutdough5/bangbangbang.git'
	}
    dir ('bangbangbang') {
        stage ('execute') {
            sh 'chmod +x ./run'
            sh './run'
        }
    }
}