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

console.log("charAt(0) = ",result.charAt(0));
console.log("charAt(result.length-1) = ", result.charAt(result.length-1));

    if (result.length-1 > 0 && result.length > block.length) {
      if (block == result.charAt(0)) {

// IMPLEMENT isMultiMatchForward

        alert(result);
      }
      else if (block == result.charAt(result.length-1)) {

        if (isMultiMatchBackward(block, result)) {

          $('#block-'+Demo.blockIndex+'-guess').html(result.charAt(result.length-1));

          Demo.blockIndex++;
          Demo.currentBlock = blocks[Demo.blockIndex];
        }
      };
    }
    else {
      $('#block-'+Demo.blockIndex+'-guess').html(result);

      if (isMatch(Demo.currentBlock, result)) {
        Demo.blockIndex++;
        Demo.currentBlock = blocks[Demo.blockIndex];

        if(!Demo.currentBlock) endGame();
      }
    };

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

  for (var i=refIndex;i<blocks.length;i++){ //forward
    if (guess == multiCharBlockForward) return true;

    multiCharBlock += blocks[i];
  };
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
