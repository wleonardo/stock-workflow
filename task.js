'use strict'

var fs = require('fs-extra');
const axios = require('axios');
const moment = require('moment');
const htmlParser = require('node-html-parser');


const getPrice = async (companyCode) => {
  // const html = await axios.get(`https://www.futunn.com/stock/${companyCode}`);

  const html = await axios.get(`https://hk.finance.yahoo.com/quote/${companyCode}/`);

  const htmlDoc = htmlParser.parse(html.data);

  const currentPrice = htmlDoc.querySelector('#main-content-wrapper .price .container section:last-child .price')?.textContent?.trim();

  return currentPrice
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runQueue = async (items, handler, intervalMs) => {
  const queue = items.slice();
  const results = [];

  while (queue.length > 0) {
    const item = queue.shift();
    const result = await handler(item);

    console.info(`${item} 的价格为 ${result.price}`);

    results.push(result);

    if (queue.length > 0) {
      await sleep(intervalMs);
    }
  }

  return results;
};

async function start() {

  try {

    const timestamp = new Date().getTime();

    const CODE_LIST = await fs.readJson(`${__dirname}/data/code.json`);

    const results = await runQueue(
      CODE_LIST,
      async (code) => {
        const price = await getPrice(code);
        return { code, price };
      },
      20 * 1000
    );

    console.info(results);

    fs.outputFileSync(`${__dirname}/data/price.json`, JSON.stringify({
      timestamp,
      data: results
    }, null, '  '))

    console.log(`更新 ${timestamp} 成功`);
  } catch (error) {
    console.error(error);
    throw Error(`更新失败，数据为空`)
  }

  // const response = await axios.get('https://danjuanfunds.com/djapi/index_eva/detail/NDX');

  // const data = response?.data?.data || {};

  // if (data?.updated_at) {
  //   const date = new moment(data.updated_at).format('YYYY-MM-DD')

  //   console.info(date);

  //   fs.outputFileSync(`${__dirname}/ndx/${date}.json`, JSON.stringify(data, null, '  '))

  //   console.log(`更新 ${date} 成功`);
  // } else {
  //   throw Error(`更新失败，数据为空`)
  // }
}
start();
