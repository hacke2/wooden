"use strict";
let path = require('path');
let fs = require('fs');
let MarkdownIt = require('markdown-it');
let md = new MarkdownIt({
    html: true,
    langPrefix: 'code-',
});
let config = require(path.join(process.cwd(),'config'));

let getAbstract = html => {
    let moreContent = html.match(/<!--\s*more\s*-->/);
    if(moreContent) {
        let i = html.indexOf(moreContent[0]);
        let subHtml = html.slice(0, i);
        return subHtml.replace(/<\/?[^>]*>/g,'');
    }
}

let getArticleDate = title =>{
    let arr = title.split('-'),
    result = [];

    for (let i = 0; i < 3; i++) {
        result[i] = arr[i];
    }
    return result.join('-');
}

let getArticle = name => {
    return new Promise((resolve, reject) => {
        
        let file = path.join(process.cwd(), '_post', name + '.md');
        fs.readFile(file, (err, data) => {
            if(err) {
                reject(err);
            }else {
                let article = parseSourceContent(name, data.toString());
                let html = md.render(article.content);
                resolve({
                    name : config.name,
                    contact : config.contact,
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
            str.split('\n').forEach(line =>{
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

let getFileList = () => {
    let dir = path.join(process.cwd(), '_post'),
        files=fs.readdirSync(dir),
        result = [];
    for(let file in files) {
        let fname = dir+path.sep+files[file];
        let stat = fs.lstatSync(fname);
        if(stat.isDirectory() == true) {
            getFileList(fname);
        }else {
            if(/[0-9]/.test(path.basename(fname).charAt(0))) {
                result.push(fname);
            }
            
        }
    }

    return result;
}


let getIndexData = () => {
    return new Promise((resolve, reject) => {
        let result = [],
            promiseList = [],
            fileList = getFileList();

        for(let i = 0; i < fileList.length; i++) {
            try {
                promiseList.push(
                    getArticle(path.basename(fileList[i], '.md'))
                );
            }catch(e) {
                console.error(e);
            }
        }
        return Promise.all(promiseList).then(articles => {
            let articleList = []
            articles.forEach(item => {
                item.abstract = getAbstract(item.content);
                articleList.push(item);
            });
            resolve({
                name : config.name,
                articleList : articleList,
                contact : config.contact
            });
        });
    });
}

module.exports = {
    getArticle: getArticle,
    getIndexData : getIndexData,
    getFileList : getFileList
}