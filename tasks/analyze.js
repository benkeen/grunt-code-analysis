/*
 * grunt-search
 * https://github.com/benkeen/grunt-search
 *
 * Copyright (c) 2013 Ben Keen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var fs   = require('fs');
	var mime = require('mime');

	var knownFileExtensions = {
		"js": "JavaScript",
		"json": "JSON"
	};


	grunt.registerMultiTask('analyze', 'A grunt plugin to generate stats about your codebase. ', function() {

		// merge task-specific and/or target-specific options with these defaults
		var options = this.options({
			logFormat: 'json'
		});

		var statsByFileExtension = {};

		// now iterate over all specified file groups
		this.files.forEach(function(f) {

			f.src.filter(function(filePath) {
				if (grunt.file.isDir(filePath)) {
					return;
				}

				// use the mime extension to do all the nasty stuff to determine the file extension. It
				// does lots of smart stuff that aren't covered by merely checking the file extension
				var fileExtension = mime.extension(mime.lookup(filePath));

				// new file extension?
				if (!statsByFileExtension.hasOwnProperty(fileExtension)) {
					statsByFileExtension[fileExtension] = {
						numFiles: 0,
						numLines: [],
						fileSizes: [],
						files: []
					}
				}

				var stats = _analyzeFile(filePath);
				statsByFileExtension[fileExtension].numFiles++;
				statsByFileExtension[fileExtension].numLines.push(stats.numLines);
				statsByFileExtension[fileExtension].fileSizes.push(stats.fileSize);
				statsByFileExtension[fileExtension].files.push(stats.file);
			});

			// now convert the raw stats into something ni
			var cleanStats = _cleanUpStats(statsByFileExtension);
			console.log(cleanStats);
		});
	});


	var _analyzeFile = function(filePath) {
		var stats = fs.statSync(filePath);
		var fileSize = stats.size;

		// now get the number of lines
		var src = grunt.file.read(filePath);
		var numLines = src.split("\n").length;

		return {
			numLines: numLines,
			fileSize: fileSize,
			file: filePath
		};
	};

	var _cleanUpStats = function(stats) {
		var cleanStats = [];
		for (var fileExtension in stats) {
			var totalLines = 0;
			var numLinesCounted = stats[fileExtension].numLines.length;
			for (var i=0; i<numLinesCounted; ++i) {
				totalLines += stats[fileExtension].numLines[i];
			}
			var averageNumLines = Math.round(totalLines / numLinesCounted);

			cleanStats.push({
				extension: fileExtension,
				numFiles: stats[fileExtension].numFiles,
				averageNumLines: averageNumLines,
				totalLines: totalLines
			});
		}

		return cleanStats;
	};
};