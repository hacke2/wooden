"use strict";

let path = require('path');
let utils = require('./utils');
let fse = require('fs-extra');
let fs = require('fs');
let jade = require('jade');
let viewPath = path.join(__dirname, '../_layout/pages');

module.exports = function (dir, options) {
	dir = dir || 'output';

	let outputDir = path.resolve(options.output || dir);

	//build index

	utils.getIndexData().then(articleList => {
		let html = jade.renderFile(path.join(viewPath, 'index.jade'), {
			title : "hacke2 's blog",
			articleList : articleList,
			isBuild : true
		});
		fse.outputFileSync(path.join(outputDir, 'index.html'), html);
	});
	
	//build post
	utils.getFileList().forEach(filePath => {
		let fileName = path.basename(filePath, '.md');
		utils.getArticle(fileName)
			.then(data => {
				let html = jade.renderFile(path.join(viewPath, 'post.jade'), data);
				fse.outputFileSync(path.join(outputDir, 'posts', fileName + '.html'), html.toString('utf-8'));
			});
		
	});
};