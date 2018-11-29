/*
**** GLOBAL VARS
*/
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition,
    SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList,
    SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent,

    recognition,
    recognitionList,
    blocks = ['안','녕','하','세','요'];

// GAME STATE
var Demo = {
  started: false,
  completed: false,
  inProgress: false,
  currentBlock: '',
  blockIndex: 0,
  blinkInterval: null
};
/*
****
*/

document.getElementById('user-input').addEventListener('change', function(e) {

  blocks = document.getElementById('user-input').value.split(" ").split("");
  console.log(blocks);
  var html = "";
  for (var i = 0; i < blocks.length; i++) {
    html += "<li id='block-" + i + "'><h3>" + blocks[i] + "</h3><h3 id='block-"+i+"-guess'></h3></li>"
  }
  document.getElementById('word-list').innerHTML = html;
});

/*
**** Recognition Config
*/
  recognition = new SpeechRecognition();
  recognitionList = new SpeechGrammarList();

  recognitionList.addFromString('#JSGF V1.0; grammar blocks; public <block> = ' + blocks.join(' | ') + ' ;');
  // recognition config
  recognition.grammars = recognitionList;
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
/*
****
*/

/*
**** EVENT HANDLERS
*/

// Unsuccessful result handlers
  recognition.onnomatch = function(event) { console.log(event) };
  recognition.onerror = function(event) { console.log(event) };
//

// when recording begins for each block
  recognition.onstart = function() {

    startBlinking();
    setCurrentBlock(Demo.blockIndex);
  }
  recognition.onend = function() {
    stopBlinking(Demo.blinkInterval);

    if (Demo.inProgress) continueGame();
  }

  recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var result = event.results[last][0].transcript;
    var block = Demo.currentBlock;
    var firstCharOfResult = result.charAt(0);
    var lastCharOfResult = result.charAt(result.length-1);

console.log("charAt(0) = ",firstCharOfResult);
console.log("charAt(result.length-1) = ", lastCharOfResult);
console.log("result = ", result);

    if (result.length-1 > 0 && result.length > block.length) {
      if (block == firstCharOfResult) {
        if (isMultiMatchForward(block, result)) {
          var nextIndex = blocks.indexOf(lastCharOfResult) + 1;
          // render each block guess
          for (var i=Demo.blockIndex;i<nextIndex;i++) {
            $('#block-'+i+'-guess').html(blocks[i]);
          };
          Demo.blockIndex = nextIndex;
          Demo.currentBlock = blocks[Demo.blockIndex];
        };
      }
      else if (block == lastCharOfResult) {
        if (isMultiMatchBackward(block, result)) {
          $('#block-'+Demo.blockIndex+'-guess').html(lastCharOfResult);
          Demo.blockIndex++;
          Demo.currentBlock = blocks[Demo.blockIndex];
        }
      }
    }
    else {
      $('#block-'+Demo.blockIndex+'-guess').html(result);

      if (isMatch(Demo.currentBlock, result)) {
        Demo.blockIndex++;
        Demo.currentBlock = blocks[Demo.blockIndex];
      }
    };
    if(!Demo.currentBlock) endGame();
  }
/* END EVENT HANDLERS */

function startGame() {
  Demo.started = true;
  Demo.inProgress = true;
  Demo.completed = false;
  Demo.blockIndex = 0;
  Demo.currentBlock = blocks[Demo.blockIndex];

  recognition.start();
};

function continueGame() {
  setCurrentBlock(Demo.blockIndex);

  recognition.start();
};

function endGame() {
  recognition.abort();

  Demo.started = false;
  Demo.inProgress = false;
  Demo.completed = true;
  Demo.blockIndex = 0;
  Demo.currentBlock = blocks[Demo.blockIndex];

  resetBlocks();
};

function isMatch(block, guess) {
  return block == guess;
};

function isMultiMatchForward(block, guess) {
  var refIndex = blocks.indexOf(block);
  var multiCharBlockForward = '';

console.log('guess in isMultiMatchForward: ', guess);

  for (var i=refIndex;i<blocks.length;i++){ //forward
    multiCharBlockForward += blocks[i];
    if (guess == multiCharBlockForward) return true;
  };

console.log("multiCharBlockForward: ", multiCharBlockForward);
  return false;
};

function isMultiMatchBackward(block, guess) {
  var refIndex = blocks.indexOf(block);
  var multiCharBlockBackward = '';

  for (var i=refIndex;i>-1;i--){ //backward
    multiCharBlockBackward = blocks[i] + multiCharBlockBackward;
    if (guess == multiCharBlockBackward) return true;
  };
  return false;
};