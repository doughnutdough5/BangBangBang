node {
	stage ('clone') {
		git branch: 'main', url: 'https://github.com/doughnutdough5/bangbangbang.git'
	}
    stage ('execute') {
        sh 'chmod +x ./run'
        sh './run'
	}
}