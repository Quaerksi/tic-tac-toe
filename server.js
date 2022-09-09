"use strict";

// const IP = "127.0.0.1";
const PORT = process.env.PORT || 8081;

const express = require("express");
const app = express();
app.use(express.static("public"));

const http = require("http");
const socketIo = require("socket.io");
const webServer = http.Server(app);
const io = socketIo(webServer);

const game1 = require('./GameModule');

//constant
const NEEDED_PLAYERS = 2;

let usersOnline = [];

//start the game
const gameStart = socket => {

  //give time for reading the information
  setTimeout(function(){
    usersOnline[0].emit('sendMessage', 'Sie spielen als X.');
    usersOnline[1].emit('sendMessage', 'Sie spielen als O.');
    io.emit('notifyAboutActivePlayer',  game1.getActivePlayer());
    io.emit('fillStatus',  '');
  }, 1500);

  game1.gameStart();
}

io.on('connection', socket => {

  //save new user
  usersOnline.push(socket);

  //assign character and create a game
  if(usersOnline.length <= NEEDED_PLAYERS){
    io.emit('notifyUserIfHeOrSheCanPlay', usersOnline.length);

    if(usersOnline.length === NEEDED_PLAYERS) {
      gameStart(socket);
    }
  }
  //handle inactive players
  else{
      socket.emit('notifyUserIfHeOrSheCanPlay', usersOnline.length);
      socket.emit('notifyAboutActivePlayer',  game1.getActivePlayer());
      if(game1.getGameResult() != 'Spiel noch nicht beendet' ) socket.emit('sendMessageTwo', game1.handleGameStatus());
      //show matchfield
      socket.emit('fillMatchfield', game1.matchfield());
    }

  //handles klicks in the matchfield
  socket.on('move', fieldId => {

    const errorTrueOrFalse = game1.move(game1.getAllPlayersCharacterInRightOrder(usersOnline.indexOf(socket)), fieldId);

    //if the game is running
    if(game1.getGameResult() === 'Spiel noch nicht beendet'){
      //check wherer is the click an decide which messages has to be remove
      errorTrueOrFalse === true ? io.emit('fillStatus',  '') : socket.emit('fillStatus', '');
      io.emit('fillMatchfield', game1.matchfield());
      //set winning informations
      game1.checkOfWin();
      //notify active player
      io.emit('notifyAboutActivePlayer',  game1.getActivePlayer());
    }

    socket.emit('fillStatus',  game1.getCurrentError());

    //send winning informations
    if (game1.handleGameStatus() !== '') {
      io.emit('sendMessage', '');
      io.emit('sendMessageTwo', game1.handleGameStatus());
    };
  });

  //handle restarts
  socket.on('disconnect', () => {

    const messageOne = 'Ein Spieler hat das Spiel verlassen. Es wird neu verbunden';

    if((usersOnline[0] === socket || usersOnline[1] === socket) &&  usersOnline.length >= 2){
      //HTML clean up
      io.emit('cleaning');
      //inform second player
      io.emit('sendMessage', messageOne);

      //Spiel ist beendet
      setTimeout(function(){
      //io.emit('sendMessage', '');
      game1.reset();

      /*******************check in the remaining sockets again*******************************************/
      	let userNew = usersOnline.filter(user => user != socket);
        usersOnline = [];
        userNew.forEach(sock => { sock.emit('relode') } );
      /*******************************************************************************************************/
      }, 2000);
    } else {

      usersOnline = usersOnline.filter(user => user != socket);
    }
  });
});


webServer.listen(PORT, () => {

    console.log(`Server running at http://${IP}:${PORT}/`);
});
