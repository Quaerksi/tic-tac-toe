'use strict'

const $  = document.querySelector.bind(document);
const $$  = document.querySelectorAll.bind(document);

const FIELDS_IN_A_ROW = 3;

const init = () => {

  makeQudraticTableWithIds(FIELDS_IN_A_ROW);
}

//eventhandler
const playFunction = ev => {

  socket.emit('move', event.target.id);
}

//make the html table, the matchfield
const makeQudraticTableWithIds = numberOfColSpan => {

  for(let i = 0; i < numberOfColSpan; i++){
    //create tr element
    var nodeTr = document.createElement("tr");
    //append tr element to table
    $('#matchfield').appendChild(nodeTr);
    for(let n = 0; n < numberOfColSpan; n++){
      //create td element
      var nodeTd = document.createElement("td");
      //add id to td element
      nodeTd.id = numberOfColSpan * i + n;
      //add event listener to td element
      (nodeTd).addEventListener('click', ev => playFunction(ev));
      //add td element to tr element
      $('#matchfield').children[i].appendChild(nodeTd);
    }
  };
}

//start
init();


//***************************socket comunication**************************************/
const socket = io.connect();

//handles users come and go information
socket.on('relode', () => {
  window.location.reload(true);
});

socket.on('notifyUserIfHeOrSheCanPlay', numberUser => {

  if(numberUser === 1){
    $('#status1').innerHTML = 'Bitte warten Sie auf Ihren Gegner!';
  }
  if(numberUser === 2){
    $('#status1').innerHTML = 'Zwei Spieler verbunden. Das Spiel kann beginnen!';
  }
  if(numberUser > 2){
    $('#status2').innerHTML = 'Sorry, es waren bereits genug Spieler online.';
    $('#status1').style.display = 'none';
    $('#info1').style.display = 'none';
  }
});

//fills $('#info1')
socket.on('sendMessage', message => {

  $('#info1').innerHTML = '' + message;
});

//fills $('#info2')
socket.on('sendMessageTwo', message => {

  $('#info2').innerHTML = '' + message;
});

//fills $('#status1')
socket.on('fillStatus', message => {

  $('#status1').innerHTML = '' + message;
});

//handles player toggle
socket.on('notifyAboutActivePlayer', activePlayer => {

  $('#info2').innerHTML = 'Am Zug ' + activePlayer + '.';

});

//fill the matchfield
socket.on('fillMatchfield', matchfield => {

  Array.from($$('#matchfield td')).forEach((elem, i) => elem.innerHTML =   matchfield[i]);
});

//clean up after restart
socket.on('cleaning', () => {

  $('#status1').innerHTML = '';
  $('#status2').innerHTML = '';
  $('#info2').innerHTML = '';
});
