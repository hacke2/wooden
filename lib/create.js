"use strict";

let path = require('path');
let utils = require('./utils');
let fse = require('fs-extra');

module.exports = dir => {
	dir = dir || '.';

	try {
	  	//create template dir
		fse.mkdirsSync(path.resolve(dir, '_layout'));
		fse.mkdirsSync(path.resolve(dir, '_post'));
		fse.mkdirsSync(path.resolve(dir, 'assets'));
		fse.mkdirsSync(path.resolve(dir, 'posts'));

		// 复制模板文件
		let tplDir = path.resolve(__dirname, '../tpl');
		fse.copySync(tplDir, dir);

		console.log('create success!');
	}catch(e) {
		console.log('create faild!');
		console.error(e);
	}
  	
};