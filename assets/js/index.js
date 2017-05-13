$('#playButton').on('click', function(e) {
  e.preventDefault();

  $playIcon = $('#playIcon');

  if (!Demo.inProgress) {
    startGame();
    $playIcon.attr('uk-icon', 'icon: refresh');
    $playIcon.html('Restart ');
  }
  else if (Demo.inProgress) {
    endGame();
    $playIcon.attr('uk-icon', 'icon: play');
    $playIcon.html('Start ');
  };
});

function setCurrentBlock(blockId) {
  resetBlocks();

  $currentBlock = $('#word-list > #block-'+blockId);

  $currentBlock.addClass('uk-active');
  $currentBlock.children('h3').addClass('uk-heading-primary');
};

function resetBlocks() {
  $allBlocks = $('#word-list li');

  $allBlocks.removeClass('uk-active');
  $allBlocks.children('h3').removeClass('uk-heading-primary');
};

function blink() {
  $recordingDot = $('#recording-dot');

  $recordingDot.fadeOut(500);
  $recordingDot.fadeIn(500);
};

function startBlinking() {
  $('#recording-dot').attr('hidden', false);
  blinkInterval = setInterval(blink, 1000);
}
function stopBlinking(intervalId) {
  clearInterval(intervalId);
  $('#recording-dot').attr('hidden', true);
}
