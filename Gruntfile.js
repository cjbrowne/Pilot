module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jison: {
			pil: {
				options: {
					moduleName: "pil"
				},
				files: {
					"js/pil.js": "js/pil_src/pil.jison"
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "js/pil_ast/",
					name: "ast",
					out: "js/pil_ast/ast-built.js"
				}
			}
		},
		watch: {
			ast: {
				files: ['js/pil_ast/ast.js','js/pil_ast/*Node.js'],
				tasks: ['requirejs']
			},
			jison: {
				files: ['js/pil_src/pil.jison'],
				tasks: ['jison']
			}
		}
	});
	grunt.loadNpmTasks('grunt-jison');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['jison','requirejs']);
}