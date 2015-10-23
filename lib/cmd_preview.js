"use strict";

let express = require('express');
let serveStatic = require('serve-static');
let path = require('path');
let fs = require('fs');
let MarkdownIt = require('markdown-it');
let child_process = require('child_process');

let md = new MarkdownIt({
	html : 'true',
	langPrefix : 'code-'
});


let markdownToHtml = function (content) {
	return md.render(content || '');
};

module.exports = function (dir) {
	dir = dir || '.';

	let app = express();

	app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
	app.set('port', (process.env.PORT || 3000))

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


	// open browers
	app.listen(app.get('port'), () => {

		let cmd = 'open "http://localhost:' + app.get('port') + '/"';

	    child_process.exec(cmd, (err, stdout, error) => {
	        if(err) {
	            console.log('error:' + error)
	        } else {
	            let url = 'http://localhost:' + app.get('port') + '/'
	            console.log('Server started: ' + url)
	        }
	    })
	})
}