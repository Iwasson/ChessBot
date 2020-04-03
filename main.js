const bot = require('node-rocketchat-bot');
const keys = require('./keys.json');

let defaultBoard = [
    //a row
    //1  2  3  4  5  6  7  8
      [],[],[],[],[],[],[],[], //a
      [],[],[],[],[],[],[],[], //b
      [],[],[],[],[],[],[],[], //c
      [],[],[],[],[],[],[],[], //d
      [],[],[],[],[],[],[],[], //e
      [],[],[],[],[],[],[],[], //f
      [],[],[],[],[],[],[],[], //g
      [],[],[],[],[],[],[],[]  //h
];


bot({
  // recommended - using 'dotenv' library with .env file
  host: keys.host,
  username: keys.username,
  password: keys.password,
  // use ssl for https
  ssl: true,
  // join room(s)
  rooms: ['bots'],
  // when ready (e.log.info logs to console, can also console.log)
  onWake: async event => event.log.info(`${event.bot.username} ready`),
  // on message
  onMessage: async event => {
    if (event.flags.isMentioned)
      event.respond(`hi ${event.message.author.name} thanks for mentioning me`)
  }
});

