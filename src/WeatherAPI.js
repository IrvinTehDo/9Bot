const dataHandler = require('./apicalls.js');

// Grabs Weather Data.
const getWeatherData = (url) => {
  const data = dataHandler.getData(url);

  // If specified error log, return results as an error.
  if (data === '{"error":{"code":1006,"message":"No matching location found."}}') {
    // console.log("ERROR MESSAGE HERE");

    const results = {
      error: true,
    };

    return results;
  }

  // return results with no error and requested data.
  const results = {
    error: false,
    temp_f: data.current.temp_f,
    city: data.location.name,
    region: data.location.region,
    localtime: data.location.localtime,
  };

  return results;
};

module.exports = {
  getWeatherData,
};
