const config = require('../config.json');
const dataHandler = require('./apicalls.js');

// Grabs Catgirl Image data.
function getRandomCatImg(nsfw) {
  const catID = dataHandler.getData(config.catAPI + nsfw).images[0].id;
  return config.nekoImageURL + catID;
}


module.exports = {
  getRandomCatImg,
};
