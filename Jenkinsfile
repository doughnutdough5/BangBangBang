node {
	stage ('clone') {
		git branch: 'main', url: 'https://github.com/doughnutdough5/bangbangbang.git'
	}
	dir ('${env.WORKSPACE}') {
		stage ('execute') {
			sh './project'
		}
	}
}