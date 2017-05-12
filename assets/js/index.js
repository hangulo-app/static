var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition,
    SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList,
    SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var gameStarted = false,
    gameCompleted = false,
    gameInProgress = false,
    blocks = [],
    currentBlock = '',
    blockIndex = 0;

/*
* BEGIN SPEECH RECOGNITION
*/
blocks = ['안','녕','하','세','요'];
var grammar = '#JSGF V1.0; grammar blocks; public <block> = ' + blocks.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'ko-KR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onsoundend = function() {}

recognition.onspeechend = function() {}

recognition.onaudioend = function() {}

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var result = event.results[last][0].transcript;

  $('#block-'+blockIndex+'-guess').html(result);

console.log('Confidence: ' + event.results[0][0].confidence);

  if (isMatch(currentBlock, result)) {
    // move to next
    blockIndex ++;
    currentBlock = blocks[blockIndex];

    // ends game if last correct match is last remaining block
    if (!currentBlock) return endGame();

    setCurrentBlock(blockIndex);
  }
}


// NO MATCH / ERROR HANDLERS
  recognition.onnomatch = function(event) {
    $('.output').html("NO MATCH FOUND");
  }

  recognition.onerror = function(event) {
    $('.output').html('Error occurred in recognition: ' + event.error);
  }

/*
* END SPEECH RECOGNITION
*/
$(document).ready(function(){
  UIkit.modal.dialog("<button class='uk-modal-close-default' type='button' uk-close></button><div class='uk-modal-header'><h2 class='uk-modal-title'>Welcome to Hangulo!</h2><div><p>Hangulo is currently under development and not yet functional. Feel free to try the demo on this page, nonetheless.</p><p>Any questions can be mailed to <span class='uk-text-primary'>joseph@hangulo.org</span></p>", {center:true});
});

function setCurrentBlock(blockId) {
  resetBlocks();

  $currentBlock = $('#word-list > #block-'+blockId+'');

  $currentBlock.addClass('uk-active');
  $currentBlock.children('h3').addClass('uk-heading-primary');
};

function resetBlocks() {
  $allBlocks = $('#word-list li');

  $allBlocks.removeClass('uk-active');
  $allBlocks.children('h3').removeClass('uk-heading-primary');
};

$('#playButton').on('click', function(e) {
  e.preventDefault();

  if (!gameInProgress) startGame();
});

function startGame() {
  recognition.start();
};
  recognition.onstart = function() {
    gameStarted = true;
    gameInProgress = true;
    gameCompleted = false;
    blockIndex = 0;

    setCurrentBlock(blockIndex);
  };

function endGame() {
  recognition.stop();
};
  recognition.onend = function() {
    gameStarted = false;
    gameInProgress = false;
    gameCompleted = true;
    blockIndex = 0;

    resetBlocks();
  };

function isMatch(block, guess) {
  return block == guess;
};
