// 辅助的js
// 命令行参数
const argv = require('yargs').argv;
const fs = require('fs');


let create = () => {
    let name = argv.name;

    if(!name) {
        console.error('请带非空参数--name执行命令!');
    }
    createDir(name);


};


let createDir = (name) => {
    if(!fs.existsSync(name)) {
        fs.mkdir(name, (error) => {
            if(error) console.error(error);
            console.log(`创建文件夹[${name}]成功！`)
        });
    } else {
        console.warn('已存在该名称的文件夹！');
        return ;
    }

    if(!fs.existsSync(`${name}/dist`)) {
        fs.mkdirSync(`${name}/dist`, (error) => {
            if(error) console.error(error);
            console.log(`创建文件夹[${name}/dist]成功！`)
        });
    }

    if(!fs.existsSync(`${name}/src`)) {
        fs.mkdirSync(`${name}/src`, (error) => {
            if(error) console.error(error);
            console.log(`创建文件夹[${name}/src]成功！`)
        });
    }

    if(!fs.existsSync(`${name}/test`)) {
        fs.mkdirSync(`${name}/test`, (error) => {
            if(error) console.error(error);
            console.log(`创建文件夹[${name}/test]成功！`)
        });
    }


    createGulpFile(name);
};

let createGulpFile = name => {
    // 生成gulp文件
    fs.writeFileSync(`${name}/gulp.config.js`, fs.readFileSync('tem/gulp.tem'));
    fs.writeFileSync(`${name}/src/${name}.js`, fs.readFileSync('tem/js.tem'));
    fs.writeFileSync(`${name}/test/${name}.html`, fs.readFileSync('tem/test-html.tem'));
};

create();