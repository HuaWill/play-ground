const fs = require('fs');
const path = require('path');

const loader = (dir) => {
  const filePath = path.resolve(__dirname, dir);
  let results = [];

  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (error, files) => {
      if (error) {
        reject(error);
      } else {
        results = files.map(file => {
          return [
            // 第一个元素用于路由，第二个元素是对应的文件
            file.replace('.js', ''), require(`${filePath}\/${file}`)
          ]
        });
        resolve(results);
      }
    });
  });
}

module.exports.loader = loader;
