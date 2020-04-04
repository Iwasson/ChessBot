const bot = require('node-rocketchat-bot');
const keys = require('./keys.json');
const fs = require('fs');

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
  //1    2    3    4    5    6    7    8
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], //h     R = rook
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], //g     N = Knight
  [],                                       //f     B = Bishop
  [],                                       //e     Q = Queen
  [],                                       //d     K = King
  [],                                       //c     P = Pawn
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], //b
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']  //a
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
    if (event.flags.isMentioned) {
      const words = event.message.content.split(' ');
      const operation = words[1] ? words[1].toLowerCase() : ''
      event.log.info(`operation is "${operation}"`)
      console.log(event.message.author);
      processCommand(event, words);
    }
  }
});

//validates commands
async function processCommand(event, words) {
  switch (words[1].toLowerCase()) {
    case "help":
      event.respond("List of commands coming soon!");
      break;
    case "rules":
      event.respond("So you want to know how to play chess huh?");
      break;
    case "move":
      break;
    case "account":
      account(event);
      break;
    case "make":
      makeAccount(event);
      break;
    case "challenge":
      challenge(event, words);
      break;
    default:
      event.respond("Incorrect Input, please try again or use help");
      break;
  }
}

//strips all punctuation and spaces from nicknames
function simplifyNick(name) {
  name = name.replace(/\s+/g, '');
  name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  return name;
}

//checks to see if a player has an account made or not
async function hasAccount(user) {
  if (user == null) {
    return false;
  }
  else {
    var textByLine = fs.readFileSync("./database/accounts.txt").toString().split("\n");
    let found = false;

    textByLine.forEach(account => {
      fields = account.split("/");
      console.log(fields[1] + " vs " + user);
      if (fields[1] == user.toString()) {
        found = true;
      }
    });

    return found;
  }
}

//makes an account for a player. This is done by taking their nick
//off of rocket chat and creating a unique id for it.
async function makeAccount(event) {
  let user = event.message.author.name;
  let userhash = parseInt(simplifyNick(user), 36);
  let currentgameid = '';

  //if the user already has an account then we need to abort and 
  //give error
  if (await hasAccount(user) == true) {
    event.respond("Looks like you already have an account!");
  }
  else {
    //each account is one line of text formatted as such
    //uniqueid/rocketnick/currentgameid
    //gameid will be null at first until they challenge someone

    let account = userhash.toString() + "/" + user.toString() + "/" + currentgameid.toString() + "\n";

    fs.appendFile("./database/accounts.txt", account, function (err) {
      if (err) throw err;
      console.log('Saved!');
      event.respond("Your account has been made!");
    });
  }
}

//gives the player their account details
async function account(event) {
  let user = event.message.author.name;
  if(await hasAccount(user) == false) {
    event.respond("Looks like you do not have an account yet.");
  }
  else {

  }
}

//creates a game between two player.
async function challenge(event, words) {
  let user = event.message.author.name;
  let opponent = words[2];

  if (await hasAccount(opponent) == false) {
    event.respond("Looks like the person you challenged does not have an account.");
  }
  else if (opponent == user) {
    event.respond("You cannot challenge yourself!");
  }
  //else {
    //load default game, set the person who was challenged to be player 1
    let turn = opponent;
    let game = defaultBoard;

    console.log(game);
 // }

}
//saves a player to the database, also allows 
//for updates on the player (keep track of stats).
async function savePlayer(event, updates) {
  let user = event.message.author.name;
  let userhash = parseInt(simplifyNick(user), 36);

  //flags to update information with
  if (updates[0] == "") {

  }

}


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

//function that runs after each move to see if a player is in check
async function checkMate(event, game) {

}
