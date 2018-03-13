const Discord = require('discord.js');
const config = require('../config.json');

const client = new Discord.Client();

const nekoAPI = require('./NekoAPI.js');
const weatherAPI = require('./WeatherAPI.js');
const stocksAPI = require('./StocksAPI.js');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Respond to trigger commands
// Built starting from https://discord.js.org/#/docs/main/stable/examples/ping
client.on('message', async (message) => {
  // If the bot is requesting it or it doesnt start with the trigger, return.
  if (message.author.bot) return;
  if (message.content.indexOf(config.trigger) !== 0) return;

  // Break up all the message by space converting it into a command and arguments that follow it.
  const args = message.content.slice(config.trigger.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // console.log(args);

  // Ping command from the Discord.JS tutorial
  if (command === 'ping') {
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  // Requests and Sends an anime catgirl picture based on parameter or lack of parameter.
  if (command === 'nyaa') {
    let nsfw;
    // If there isn't an argument, user didnt request nsfw or anything at all.
    if (args.length === 0) {
      nsfw = 'false';
    } else if (args.length === 1 && args[0] === 'nsfw') {
      // If there is an argument user and it's nsfw, user requested nsfw
      nsfw = 'true';
    } else {
      // If neither, they probably typed the command wrong.
      await message.channel.send('Incorrect Parameters');
      return;
    }

    // Grab an image from API through helper method.
    const img = nekoAPI.getRandomCatImg(nsfw);

    // Discord Embed Format.
    const embed = new Discord.RichEmbed()
      .setColor(3447003)
      .setDescription('Nyaa')
      .setImage(img)
      .setFooter('Image generated from nekos.brussell.me');

    // Push embed to discord.
    await message.channel.send({ embed });
  }

  // Request weather based on location
  if (command === 'weather') {
    // Requires exactly one argument.
    if (args.length !== 1) {
      await message.channel.send('Incorrect Parameters');
      return;
    }

    // Build URL based on parameter.
    const url = `https://api.apixu.com/v1/current.json?key=${config.apixuKey}&q=${args[0]}`;

    // Grabs and pushes results to web
    const results = weatherAPI.getWeatherData(url);
    // If we ran into an error, send error message.
    if (results.error) {
      await message.channel.send('Location you requested does not exist');
    } else {
      // Otherwise, send data
      await message.channel.send(`It is currently ${results.temp_f} degrees farienheit in ${results.city}, ${results.region}. The local time is ${results.localtime}.`);
    }
  }

  // Grabs stock data from two parameters.
  if (command === 'stocks') {
    // Requires two arguments
    if (args.length !== 2) {
      await message.channel.send('Incorrect Parameters');
      return;
    }


    let url;
    let data;
    let color;
    let emoji;


    // if not daily or weekly in first argument, error message and return.
    if (args[0] !== 'daily' && args[0] !== 'weekly') {
      await message.channel.send('Incorrect Parameters');
      return;
    }

    // If daily, grab daily data.
    if (args[0] === 'daily') {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${
        args[1]
      }&apikey=${
        config.alphaVantageAPI}`;

      data = stocksAPI.getDailyStocksData(url);
    } else {
      // Else, it's weekly, grab weekly data.
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${
        args[1]
      }&apikey=${
        config.alphaVantageAPI}`;

      data = stocksAPI.getWeeklyStocksData(url);
    }
    // If we didnt get an error, display results formatted to discord..
    if (!data.error) {
      // Is the percent change negative or positive? Use the emoji correlating to results.
      if (data.change >= 0) {
        /*eslint-disable */
        emoji = '\:chart_with_upwards_trend:';
        /* eslint-enable */
        color = 3066993;
      } else {
        /*eslint-disable */
        emoji = '\:chart_with_downwards_trend:';
        /* eslint-enable */
        color = 15158332;
      }

      // Send formatted data to discord.
      message.channel.send({
        embed: {
          color,
          title: `${data.symbol + emoji} ${data.change}%`,
          fields: [
            {
              name: 'Date',
              value: data.date,
            },
            {
              name: 'Volume',
              value: data.volume,
            },
            {
              name: 'Open',
              value: data.open,
            },
            {
              name: 'Close',
              value: data.close,
            },
            {
              name: 'High',
              value: data.high,
            },
            {
              name: 'Low',
              value: data.low,
            },
          ],
          footer: {
            text: 'Data from Alpha Vantage API',
          },
        },
      });
    } else {
      // Otherwise, Whoops, we got an error, send the error message.
      message.channel.send(data.message);
    }

    // console.log(data);
  }

//  // Unfinished youtube command, takes a parameter of some sotr and returns requested video.
//  if (command === 'youtube') {
//    io.emit('youtube', 'https://www.youtube.com/embed/vWhmfSleUWg');
//  }
});

client.login(config.token);

