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
          let stats = fs.statSync(`${filePath}/${file}`);
          return stats.isDirectory() 
            ? [ file, require(`${filePath}\/${file}/index.js`) ]
            : [ file.replace('.js', ''), require(`${filePath}\/${file}`) ]
        });
        resolve(results);
      }
    });
  });
}

module.exports.loader = loader;
