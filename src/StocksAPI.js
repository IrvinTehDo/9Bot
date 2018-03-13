const dataHandler = require('./apicalls.js');

// Grabs Daily requested data.
const getDailyStocksData = (url) => {
  const data = dataHandler.getData(url);
  // If length is 1, which is the exact length of resutls
  // with only an error message, return results with error.
  if (Object.keys(data).length === 1) {
    // console.log("error message here");

    const results = {
      error: true,
      message: 'The symbol you requested does not exist.',
    };

    return results;
  }

  const dates = Object.keys(data['Time Series (Daily)']);

  const symbol = data['Meta Data']['2. Symbol'];
  const date = data['Meta Data']['3. Last Refreshed'];
  const open = data['Time Series (Daily)'][date]['1. open'];
  const high = data['Time Series (Daily)'][date]['2. high'];
  const low = data['Time Series (Daily)'][date]['3. low'];
  const close = data['Time Series (Daily)'][date]['4. close'];
  const volume = data['Time Series (Daily)'][date]['5. volume'];
  // Calculate percent change.
  const change = Number(`${Math.round(`${((close - data['Time Series (Daily)'][dates[1]]['4. close']) / (close)) * 100}e2`)}e-2`);

  const results = {
    isDaily: true,
    error: false,
    symbol,
    date,
    open,
    high,
    low,
    close,
    volume,
    change,
  };

  return results;
};

// Grabs Weekly requested data similar to Daily.
const getWeeklyStocksData = (url) => {
  const data = dataHandler.getData(url);

  if (Object.keys(data).length === 1) {
    // console.log("error message here");

    const results = {
      error: true,
      message: 'The symbol you requested does not exist.',
    };

    return results;
  }

  const dates = Object.keys(data['Weekly Time Series']);

  const symbol = data['Meta Data']['2. Symbol'];
  const date = data['Meta Data']['3. Last Refreshed'];
  const open = data['Weekly Time Series'][date]['1. open'];
  const high = data['Weekly Time Series'][date]['2. high'];
  const low = data['Weekly Time Series'][date]['3. low'];
  const close = data['Weekly Time Series'][date]['4. close'];
  const volume = data['Weekly Time Series'][date]['5. volume'];
  const change = Number(`${Math.round(`${((close - data['Weekly Time Series'][dates[1]]['4. close']) / (close)) * 100}e2`)}e-2`);


  const results = {
    isDaily: false,
    error: false,
    symbol,
    date,
    open,
    high,
    low,
    close,
    volume,
    change,
  };

  return results;
};

module.exports = {
  getDailyStocksData,
  getWeeklyStocksData,
};
