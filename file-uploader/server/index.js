const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const {generateUniqueFileName} = require('../utils');

const express = require('express');
const app = express();

app.listen(config.PORT, () => {
  console.log(`Server is running on PORT: ${config.PORT}`);
});

// middleware configuration
app.use((req, res, next) => {
  const {
    ALLOW_METHODS,
    ALLOW_HEADERS,
    ALLOW_ORIGIN,
    ALLOW_CREDENTIALS
  } = config.CORS;

	res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Credentials", ALLOW_CREDENTIALS);
	res.header("Access-Control-Allow-Headers", ALLOW_HEADERS);
  res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
  
  if (req.method === 'OPTIONS') {
    res.send('Current service supports CORS request');
  } else {
    next();
  }
});

// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb' 
}));

app.use('/upload', express.static(path.resolve(__dirname, 'upload')));

const UPLOAD_DIR = path.resolve(__dirname, 'upload');
const CHUNK_TMP_DIR = path.resolve(__dirname, 'upload', 'tmp');

// API endpoint starts here
app.post('/form-data', (req, res) => {
  new multiparty.Form().parse(req, (err, fields, file) => {
    if (err) {
      res.send({ code: 1, codeText: err});
      return;
    }

    const [chunk] = file.chunk;
    const [fileName] = fields.fileName;
    const uniqueFileName = generateUniqueFileName(fileName);
    const chunkDir = `${UPLOAD_DIR}/${uniqueFileName}`;

    let readStream = fs.createReadStream(chunk.path);
    let writeStream = fs.createWriteStream(chunkDir);
    
    readStream.pipe(writeStream);
    readStream.on('end', () => {
      fs.unlinkSync(chunk.path);
    });

    res.send({
      code: 0,
      codeText: 'success',
      path: `http://127.0.0.1:${config.PORT}/upload/${uniqueFileName}`
    });
  });
});

app.post('/base64', (req, res) => {
  let {chunk, fileName} = req.body;
  const uniqueFileName = generateUniqueFileName(fileName);
  const chunkDir = `${UPLOAD_DIR}/${uniqueFileName}`;

  chunk = decodeURIComponent(chunk).replace(/^data:image\/\w+;base64,/, "");
  chunk = Buffer.from(chunk, 'base64');
  fs.writeFileSync(chunkDir, chunk);
  res.send({
    code: 0,
    codeText: 'success',
    path: `http://127.0.0.1:${config.PORT}/upload/${uniqueFileName}`
  });
});

app.post('/chunk', (req, res) => {
  new multiparty.Form().parse(req, (err, fields, file) => {
    if (err) {
      res.send({ code: 1, codeText: err});
      return;
    }

    const [chunk] = file.chunk;
    const [fileName] = fields.fileName;

    if (!fs.existsSync(CHUNK_TMP_DIR)) {
      fs.mkdirSync(CHUNK_TMP_DIR);
    }

    let chunkDir = CHUNK_TMP_DIR + `/${fileName}`;
    let readStream = fs.createReadStream(chunk.path);
    let writeStream = fs.createWriteStream(chunkDir);

    readStream.pipe(writeStream);
    readStream.on('end', () => {
      fs.unlinkSync(chunk.path);
    });

    res.send({
      code: 0,
      codeText: 'success'
    });
  });
});

app.post('/merge', (req, res) => {
  const {fileName} = req.body;
  const uniqueFileName = generateUniqueFileName(fileName);
  
  let chunkFiles = [];

  if (fs.existsSync(CHUNK_TMP_DIR)) {
    chunkFiles = fs.readdirSync(CHUNK_TMP_DIR);
  }
  chunkFiles.sort((f1, f2) => {
    let idx1 = f1.split('---')[0];
    let idx2 = f2.split('---')[0];
    return (+idx1.match(/\d+/)[0]) - (+idx2.match(/\d+/)[0]);
  })
  chunkFiles.forEach(chunk => {
    fs.appendFileSync(`${UPLOAD_DIR}/${uniqueFileName}`, fs.readFileSync(`${CHUNK_TMP_DIR}/${chunk}`));
    fs.unlinkSync(`${CHUNK_TMP_DIR}/${chunk}`);
  })

  res.send({
		code: 0,
		codeText: 'success',
		path: `http://127.0.0.1:${config.PORT}/upload/${uniqueFileName}`
	});

});