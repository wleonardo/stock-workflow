'use strict'

var fs = require('fs-extra');

async function start() {
  await fs.writeFile('README.md', new Date().getTime());
  console.log('更新README.md成功');
}
start();