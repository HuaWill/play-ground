const uuid = require('node-uuid');

module.exports = {
  generateUniqueFileName: (fileName) => {
    const decodeFileName = decodeURIComponent(fileName);
    const dotIdx = decodeFileName.lastIndexOf('.');
    const preName = decodeFileName.substring(0, dotIdx);
    const extName = decodeFileName.substring(dotIdx + 1);
    return `${preName}-${uuid.v4()}.${extName}`;
  },

  getFileExtName: (fileName) => {
    const dotIdx = fileName.lastIndexOf('.');
    return fileName.substring(dotIdx + 1);
  }
}