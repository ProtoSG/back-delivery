const { Router } = require('express');
const { readdirSync } = require('fs');

const PATH_DIR = `${__dirname}`;

const router = Router();

const cleanFileName = (fileName) => {
  return fileName.split('.').shift();
}

readdirSync(PATH_DIR).forEach((file) => {
  const fileName = cleanFileName(file);
  if (fileName !== 'index') {
    router.use(`/${fileName}`, require(`./${fileName}.routes`));
  }
})

module.exports = router;
