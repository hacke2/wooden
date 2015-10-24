"use strict";
let path = require('path');
let fs = require('fs');
let MarkdownIt = require('markdown-it');
let md = new MarkdownIt({
    html: true,
    langPrefix: 'code-',
});

let getAbstract = (html) => {
    let moreContent = html.match(/<!--\s*more\s*-->/);
    if(moreContent) {
        let i = html.indexOf(moreContent[0]);
        let subHtml = html.slice(0, i);
        return subHtml.replace(/<\/?[^>]*>/g,'');
    }
}

let getArticleDate = (title) =>{
    let arr = title.split('-'),
    result = [];

    for (let i = 0; i < 3; i++) {
        result[i] = arr[i];
    }

    return result.join('-');
}

let getArticle = function(name) {
    return new Promise(function (resolve, reject) {
        let file = path.join(__dirname, '../_post', name + '.md');

        fs.readFile(file, function (err, data) {
            if(err) {
                reject(err);
            }else {
                let article = parseSourceContent(name, data.toString());
                let html = markdownToHTML(article.content);
                resolve({
                    title : article.title,
                    content : html,
                    date : article.date,
                    href : article.href
                });
            }
        });
    })
}

// 解析文章内容
let parseSourceContent = (name, data) =>{
    let split = '---\n';
    let i = data.indexOf(split);
    let article = {};
    if (i !== -1) {
        let j = data.indexOf(split, i + split.length);
        if (j !== -1) {
            let str = data.slice(i + split.length, j).trim();
            data = data.slice(j + split.length);
            str.split('\n').forEach(function(line) {
                let i = line.indexOf(':');
                if (i !== -1) {
                    let name = line.slice(0, i).trim();
                    let value = line.slice(i + 1).trim();
                    article[name] = value;
                }
            });
        }
    }
    article.content = data;
    article.href = 'posts/' + name;
    article.date = getArticleDate(name);
    return article;
}

let markdownToHTML = (content) =>{
    return md.render(content || '');
}

let getFileList = () => {
    let dir = path.join(__dirname, '../_post'),
        files=fs.readdirSync(dir),
        result = [];
    for(let file in files) {
        let fname = dir+path.sep+files[file];
        let stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true) {
            getFileList(fname);
        }else {
            result.push(path.basename(fname, '.md'));
        }
    }

    return result;
}


let getIndexData = () => {
    return new Promise(function (resolve, reject) {
        let result = [],
            promiseList = [],
            fileList = getFileList();

        for(let i = 0; i < fileList.length; i++) {
            promiseList.push(
                getArticle(fileList[i])
            );
        }
        return Promise.all(promiseList).then(function (articles) {
            let result = []
            articles.forEach(function(item) {
                item.abstract = getAbstract(item.content);
                result.push(item);
            });
            resolve(result);
        });
    });
}

module.exports = {
    getArticle: getArticle,
    getIndexData : getIndexData
}