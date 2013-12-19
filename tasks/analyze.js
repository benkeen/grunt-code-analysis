/*
 * grunt-search
 * https://github.com/benkeen/grunt-search
 *
 * Copyright (c) 2013 Ben Keen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.registerMultiTask('search', 'A grunt plugin to generate stats about your codebase. ', function() {

		// merge task-specific and/or target-specific options with these defaults
		var options = this.options({
			logFormat: 'json'
		});

		// now iterate over all specified file groups
		this.files.forEach(function(f) {

			// filter out invalid files and folders
			var filePaths = [];
			f.src.filter(function(filepath) {
				if (grunt.file.isDir(filepath)) {
					return;
				}

				console.log(filepath);

				// *** this was in the gruntplugin example, but it doesn't seem to even GET here if the file specified
				// doesn't exist... ***
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
				} else {
					filePaths.push(filepath);
				}
			});

			// write the log file - even if there are no results. It'll just contain a "numResults: 0" which is useful
			// in of itself
			//_generateLogFile(options, filePaths, matches, numMatches);
		});
	});


	var _generateLogFile = function(options, filePaths, results, numResults) {
		var content = '';

		if (options.logFormat === "json") {
			content = _getJSONLogFormat(options, filePaths, results, numResults);
		} else if (options.logFormat === "xml") {
			content = _getXMLLogFormat(options, filePaths, results, numResults);
		} else if (options.logFormat === "text") {
			content = _getTextLogFormat(options, filePaths, results, numResults);
		}

		grunt.file.write(options.logFile, content);
	};


	/**
	 * This generates a JSON formatted file of the match results. Boy I miss templating. :-)
	 * @param options
	 * @param results
	 * @param numResults
	 * @returns {string}
	 * @private
	 */
	var _getJSONLogFormat = function(options, filePaths, results, numResults) {
		var content = "{\n\t\"numResults\": " + numResults + ",\n"
			+ "\t\"creationDate\": \"" + _getISODateString() + "\",\n"
			+ "\t\"results\": {\n";

		var group = [];
		for (var file in results) {
			var groupStr = "\t\t\"" + file + "\": [\n";

			var matchGroup = [];
			for (var i=0; i<results[file].length; i++) {
				matchGroup.push("\t\t\t{\n"
					+ "\t\t\t\t\"line\": " + results[file][i].line + ",\n"
					+ "\t\t\t\t\"match\": " + "\"" + _cleanStr(results[file][i].match) + "\""
					+ "\n\t\t\t}");
			}
			groupStr += matchGroup.join(",\n") + "\n";
			groupStr += "\t\t]"
			group.push(groupStr);
		}
		content += group.join(",\n");
		content += "\n\t}"

		if (options.outputExaminedFiles) {
			content += ",\n\t\"examinedFiles\": [\n";
			var files = [];
			for (var i=0; i<filePaths.length; i++) {
				files.push("\t\t\"" + _cleanStr(filePaths[i]) + "\"");
			}
			content += files.join(",\n");
			content += "\n\t]";
		}

		content += "\n}";

		return content;
	};

	// helpers ----------------

	var _cleanStr = function(str) {
		return str.replace(/"/g, "\\\"");
	}

	var _getISODateString = function() {
		var d = new Date();
		function pad(n) {
			return n < 10 ? '0' + n : n;
		}
		return d.getUTCFullYear()+'-'
			+ pad(d.getUTCMonth()+1)+'-'
			+ pad(d.getUTCDate()) +' '
			+ pad(d.getUTCHours())+':'
			+ pad(d.getUTCMinutes())+':'
			+ pad(d.getUTCSeconds())
	};
};