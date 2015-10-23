"use strict";

let express = require('express');
let path = require('path');
let fs = require('fs');
let child_process = require('child_process');
let jade = require('jade');
let utils = require('./utils');


module.exports = function (dir) {
	dir = dir || '.';

	let app = express();


	app.use(express.static(path.join(__dirname, '../assets')));
	app.use(express.static(path.join(__dirname, '../bower_components')));
	
	app.set('port', (process.env.PORT || 3000));

	app.set('views', path.join(__dirname, '../_layout/pages'));
	app.set('view engine','jade')

	//render article
	app.get('/posts/:articleName', (req, res, next) => {
		let name = req.params.articleName;
		let file = path.resolve(dir, '_post', name + '.md');

		fs.readFile(file, function (err, data) {
			if(err) {
				return next(err);
			}else {
				let source = utils.parseSourceContent(data.toString());
				source.html = utils.markdownToHTML(source.html);
				res.render('post', {
					title : source.title,
					html : source.html,
					date : utils.getArticleDate(name)
				});
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