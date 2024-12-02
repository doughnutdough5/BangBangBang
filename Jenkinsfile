node {
	stage ('clone') {
		git 'https://github.com/doughnutdough5/bangbangbang.git'
	}
	dir ('${env.HOME}') {
		stage ('execute') {
			sh './project'
		}
	}
}