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
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //f     B = Bishop
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //e     Q = Queen
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //d     K = King
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //c     P = Pawn
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
    case "display":
      display(event, words);
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
      if (fields[0] == user.toString()) {
        found = true;
      }
    });

    return found;
  }
}

async function hasGame(event, opponent) {
  let user = event.message.author.name;
  let found = false;

  var accounts = fs.readFileSync("./database/accounts.txt").toString().split("\n");

  accounts.forEach(account => {
    if(account.startsWith(user)) {
      if(account.includes(opponent)) {
        found = true;
      }
    }
  });

  return found;
}

//makes an account for a player. This is done by taking their nick
//off of rocket chat and creating a unique id for it.
async function makeAccount(event) {
  let user = event.message.author.name;
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

    let account = user.toString() + "/" + currentgameid.toString() + "\n";

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
  if (await hasAccount(user) == false) {
    event.respond("Looks like you do not have an account yet.");
  }
  else {
    var accounts = fs.readFileSync("./database/accounts.txt").toString().split("\n");

    accounts.forEach(account => {
      fields = account.split("/");
      if (fields[0] == user.toString()) {
        let games = "";

        if (fields.length > 2) {
          for (var i = 1; i < fields.length; i += 1) {
            games += i + ")" + fields[i] + "\n";
          }
        }
        else {
          games = "None! Come on, challenge someone!";
        }

        event.respond("Account summary: " +
          "\nName: " + fields[0] +
          "\nGames you are in: \n" + games);
      }
    });
  }
}

//creates a game between two player.
async function challenge(event, words) {
  let user = event.message.author.name;
  let opponent = words[2];

  //you need an account to challenge people
  if (await hasAccount(opponent) == false) {
    event.respond("Looks like the person you challenged does not have an account.");
  }
  //cant challenge yourself to a game, thats bad
  else if (opponent == user) {
    event.respond("You cannot challenge yourself!");
  }
  //cant challenge the same person twice, thats bad too
  else if(await hasGame(event, opponent) == true) {
    event.respond("You already have a game going with them!");
  }
  else {
  //load default game, set the person who was challenged to be player 1
  let turn = opponent;
  let game = defaultBoard;

  data = {game: game, turn: turn};

  //var jsonData = JSON.stringify(defaultBoard);
  var jsonData = JSON.stringify(data);
  await fs.writeFile("./database/" + user + " vs " + opponent + ".txt", jsonData + "\n", function (err) {
    if (err) {
      console.log(err);
    }
  });

  /*
  var jsonData = JSON.stringify(user);

  await fs.appendFile("./database/" + user + " vs " + opponent + ".txt", jsonData, function (err) {
    if (err) {
      console.log(err);
    }
  });
*/
  savePlayer(event, "append", user + " vs " + opponent);
  }

}
//saves a player to the database, also allows 
//for updates on the player (keep track of stats).
async function savePlayer(event, flag, data) {
  let user = event.message.author.name;
  let pos = 0;
  let index = 0;
  var accounts = fs.readFileSync("./database/accounts.txt").toString().split("\n");

  //flags to update information with
  //append means we add data to the end of the account. Such as adding new games to the list
  if(flag == "append") {
    accounts.forEach(account => {
      if(account.startsWith(user)) {
        index = pos;
      }
      pos += 1;
    });
    accounts[index] += data + "/";
    await fs.writeFile("./database/accounts.txt", accounts.toString(), function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
}


//this function will save the game after each move
async function saveGame(event, game) {

}

//displays the game
async function display(event, words) {
  let user = event.message.author.name;
  let game = words[2];

  if (game == null) {
    event.respond("You need to specify which game you want to display.");
  }
  else {
    let gameBoard = await loadGame(event, game);
    event.respond("Turn: " + gameBoard.turn + "\n" + gameBoard.game.toString());
  }
}

//this function will load the game for display and move validation 
async function loadGame(event, game) {
  var textByLine = fs.readFileSync("./database/accounts.txt").toString().split("\n");
  let user = event.message.author.name;
  let found = false;
  let gameName = "";

  textByLine.forEach(account => {
    fields = account.split("/");
    if (fields[0] == user.toString()) {
      if (fields[game] != null) {
        gameName = fields[game];
        found = true;
      }
    }
  });

  if(found == false) {
    event.respond("Specified game was not found!");
  }
  else {
    let gameBoardData = fs.readFileSync("./database/" + gameName + ".txt");
    let gameBoard = JSON.parse(gameBoardData);
    return gameBoard;
  }
}

//this will attempt to move a piece to a space
//takes in piece, position of piece and desitantion 
//as arguments in words
async function movePiece(words, event, game) {

}

//function that runs after each move to see if a player is in check
async function checkMate(event, game) {

}
