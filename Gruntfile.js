/*
 * grunt-search
 * https://github.com/benkeen/grunt-search
 *
 * Copyright (c) 2013 Ben Keen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		// before generating any new files, remove any previously-created files
		clean: {
			tests: ['test/tmp']
		},

		// configuration to be run (and then tested)
		search: {
			default: {
				files: {
					src: ["**/*"]
				},
				options: {
					logFile: "test/tmp/results.json",
					logFormat: "json"
				}
			}
		},

		// unit tests
		nodeunit: {
			tests: ['test/*_test.js']
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's task(s), then test the result
	grunt.registerTask('test', ['clean', 'search', 'nodeunit']);

	// by default, lint and run all tests
	grunt.registerTask('default', ['search', 'test']);
};