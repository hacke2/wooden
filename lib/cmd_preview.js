"use strict";

let express = require('express');
let serveStatic = require('serve-static');
let path = require('path');
let fs = require('fs');
let MarkdownIt = require('markdown-it');

let md = new MarkdownIt({
	html : 'true',
	langPrefix : 'code-'
});

//get file real name with no extend
let getFileName = function (name) {
	let i = 0 - path.extname(name).length;
	if(i === 0) {
		i = name.length;
	}
	return name.slice(0, 1);
}


let markdownToHtml = function (content) {
	return md.render(content || '');
}

module.exports = function (dir) {
	dir = dir || '.';

	let app = express();

	app.use('/assets', serveStatic(path.resolve(dir, 'assets')));


	//render article
	app.get('/posts/:articleName', (req, res, next) => {
		let name = req.params.articleName;
		let file = path.resolve(dir, '_post', name + '.md');

		fs.readFile(file, function (err, data) {
			if(err) {
				return next(err);
			}else {
				let html = markdownToHtml(data.toString());
				res.end(html);
			}
		})
		
	});

	//render list
	app.get('/', (req, res, next) => {

		res.end('article list');
	});


	app.listen(3000);
}