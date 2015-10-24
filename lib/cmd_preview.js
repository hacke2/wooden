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
		utils.getArticle(name)
				.then(function(data) {
					res.render('post', data);
				})
				.catch(function (err) {
					next(err);
				});
	});

	//render list
	app.get('/', (req, res, next) => {

		utils.getIndexData()
				.then(function (articleList) {
					res.render('index', {
						title : "hacke2 's blog",
						articleList : articleList
					});
				})
				.catch(function (err) {
					next(err);
				});
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