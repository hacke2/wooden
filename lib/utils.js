"use strict";
let path = require('path');
let fs = require('fs');
let MarkdownIt = require('markdown-it');
let md = new MarkdownIt({
    html: true,
    langPrefix: 'code-',
});

let getArticleDate = (title) =>{
    let arr = title.split('-'),
    result = [];

    for (let i = 0; i < 3; i++) {
        result[i] = arr[i];
    }

    return result.join('-');
}

// 解析文章内容
let parseSourceContent = (data) =>{
    let split = '---\n';
    let i = data.indexOf(split);
    let info = {};
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
                    info[name] = value;
                }
            });
        }
    }
    info.html = data;
    return info;
}

let markdownToHTML = (content) =>{
    return md.render(content || '');
}

module.exports = {
    parseSourceContent: parseSourceContent,
    markdownToHTML: markdownToHTML,
    getArticleDate : getArticleDate
}