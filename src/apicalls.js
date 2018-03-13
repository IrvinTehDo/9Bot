// https://github.com/tmpvar/jsdom (make a blank html page for jquery calls)
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// Make a false instance of an html page for jquery.
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
const $ = require('jquery')(dom.window);

// Helper Functions

// Handles JQuery ajax requests and passes it on as a json to be deciphered.

const getData = (url) => {
  let data;

  $.ajax({
    url,
    async: false,
    dataType: 'json',
    success(o) {
      data = o;
    },
    error(o) {
      data = o.responseText;
    },
  });

  return data;
};

module.exports = {
  getData,
};
