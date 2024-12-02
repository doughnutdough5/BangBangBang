node {
	stage ('clone') {
		git branch: 'main', url: 'https://github.com/doughnutdough5/bangbangbang.git'
	}
    stage ('execute') {
        dir ('${env.WORKSPACE}') {
            sh 'chmod +x ./run'
			sh './run'
		}
	}
}