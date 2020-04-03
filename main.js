const bot = require('node-rocketchat-bot');
const keys = require('./keys.json');

//the bot will allow multiple games of 2 people to play chess
//across rocket chat. It will require players to make an account
//to play. This will assign a key to each person on rocket.
//When one person challenges a second person to a game, it will 
//append the two keys together, and this will form the game id.
//These game ids will be stored along with the corresponding board 
//in a text file that acts as the database and it will be saved to and 
//loaded from each time a player wants to make a move. This means that 
//if the computer the bot is running on goes down the progress wont be lost
//and it will allow multiple people the ability to play at the same time.

//a default board that the game can load for each new game
//black pieces will be CAPS and white will be lower
//h1 is a white space and all other alternate off of that
//black starts on top and white starts on the bottom
let defaultBoard = [
    //a row
    // 1  2  3  4  5  6  7  8
      [R, N, B, Q, K, B, N, R], //h     R = rook
      [P, P, P, P, P, P, P, P], //g     N = Knight
      [                      ], //f     B = Bishop
      [                      ], //e     Q = Queen
      [                      ], //d     K = King
      [                      ], //c     P = Pawn
      [p, p, p, p, p, p, p, p], //b
      [r, n, b, q, k, b, n, r]  //a
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


//this function will save the game after each move
async function saveGame(event, game) {

}

//this function will load the game for display and move validation 
async function loadGame(event, game) {

}

//this will attempt to move a piece to a space
//takes in piece, position of piece and desitantion 
//as arguments in words
async function movePiece(words, event, game) {

}