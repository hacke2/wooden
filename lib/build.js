"use strict";

let path = require('path');
let utils = require('./utils');
let fse = require('fs-extra');
let fs = require('fs');
let jade = require('jade');
let util = require('util');


module.exports = function (dir, options) {

	dir = dir || process.cwd();

	let outputDir = path.resolve(options.output || dir);
	
	let viewPath = path.join(outputDir, '_layout/pages');
	//build index



	utils.getIndexData().then(data => {

		data.isBuild = true;
		
		console.log('build ' + path.join(viewPath, 'index.jade'))
		let html = jade.renderFile(path.join(viewPath, 'index.jade'), data);
		fse.outputFileSync(path.join(outputDir, 'index.html'), html);
	});
	
	//build post
	utils.getFileList().forEach(filePath => {
		let fileName = path.basename(filePath, '.md');
		utils.getArticle(fileName)
			.then(data => {
				console.log('build ' + path.join(viewPath, 'post.jade'))
				let html = jade.renderFile(path.join(viewPath, 'post.jade'), data);
				fse.outputFileSync(path.join(outputDir, 'posts', fileName + '.html'), html.toString('utf-8'));
			});
		
	});

	console.log('build success!')
};