'use strict';

//matchfield object
let score = {
  matchfield: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  activePlayer: 'X',
  gameResult: ''
};

//constants
const ACTIVE_PLAYER = ['X', 'O'];
const GAME_RESULTS = ['X gewinnt', 'O gewinnt', 'unentschieden', 'Spiel noch nicht beendet' ]
// 8 ways to win
const WIN = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

//is filled if player moves wrong
let currentError = '';

//check for results in the game
exports.checkOfWin = () => {

  //check for winning constellation
  WIN.forEach((elem, i) => {

     if(score.matchfield[elem[0]] != ' '){

       if(score.matchfield[elem[0]] === score.matchfield[elem[1]] && score.matchfield[elem[0]] === score.matchfield[elem[2]]) {
        //post the right message
        score.matchfield[elem[0]] === 'X' ? score.gameResult = GAME_RESULTS[0] : score.gameResult = GAME_RESULTS[1];
      }
     }
  });

  //check if draw
  const allFieldsFUll = score.matchfield.every(field => field === ACTIVE_PLAYER[0] || field === ACTIVE_PLAYER[1]);
  allFieldsFUll && (score.gameResult ===  GAME_RESULTS[3]) ? score.gameResult = GAME_RESULTS[2] : '';
};

//handles clicks in the matchfield
exports.move = (player, field) => {
  //reset error
  currentError = ' ';

  if(score.gameResult === 'X gewinnt' || score.gameResult === 'O gewinnt') currentError = 'Das Spiel ist bereits zu Ende.';

  else if(player !== score.activePlayer) {
    currentError = 'Der Zug wird vom nicht aktiven Spieler durchgeführt.';
    return false;
  }
  else if(score.matchfield[field] !== ' ') {
    currentError = 'Das Zielfeld ist nicht frei.';
    return false;
  }
  else if(score.gameResult === 'Spiel noch nicht beendet' && player === score.activePlayer && score.matchfield[field] === ' ' ) {
    score.matchfield[field] = player;
    toggleActivePLayer();
    return true;
  }
  else {
    console.log('Error in GameModule.js move(player, field)')
  }
}

exports.reset = () => {

  score.matchfield.forEach((elem, i) => score.matchfield[i] = ' ');
  score.activePlayer = ACTIVE_PLAYER[0];
  score.gameResult = '';
}

exports.gameStart = () => score.gameResult = GAME_RESULTS[3];

exports.matchfield = () => score.matchfield;

exports.getActivePlayer = () => score.activePlayer;

exports.getAllPlayersCharacterInRightOrder = i => ACTIVE_PLAYER[i];

exports.getCurrentError = () => currentError;

exports.getGameResult = () => score.gameResult;

//check game status
exports.handleGameStatus = () => {

  if (score.gameResult === GAME_RESULTS[0]) return 'Spiel beendet: Spieler X hat gewonnen!';
  if (score.gameResult === GAME_RESULTS[1]) return 'Spiel beendet: Spieler O hat gewonnen!';
  if (score.gameResult === GAME_RESULTS[2]) return 'Das Spiel endet unentschieden!';

  return '';
}

const toggleActivePLayer = () => score.activePlayer != 'O' ?   score.activePlayer = 'O' :   score.activePlayer = 'X';
