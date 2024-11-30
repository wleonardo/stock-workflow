'use strict'

var fs = require('fs-extra');
const axios  = require('axios');
const moment = require('moment');

async function start() {

  const response = await axios.get('https://danjuanfunds.com/djapi/index_eva/detail/NDX');

  const data = response?.data?.data || {};

  if (data?.updated_at) {
    const date = new moment(data.updated_at).format('YYYY-MM-DD')

    console.info(date);

    fs.outputFileSync(`${__dirname}/ndx/${date}.json`, JSON.stringify(data, null, '  '))

    console.log(`更新 ${date} 成功`);
  } else {
    throw Error(`更新失败，数据为空`)
  }
}
start();