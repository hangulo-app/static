$(document).ready(function(){
  UIkit.modal.dialog("<button class='uk-modal-close-default' type='button' uk-close></button><div class='uk-modal-header'><h2 class='uk-modal-title'>Welcome to Hangulo!</h2><div><p>Hangulo is currently under development and not yet functional. Feel free to try the demo on this page, nonetheless.</p><p>Any questions can be mailed to <span class='uk-text-primary'>joseph@hangulo.org</span></p>", {center:true});
});


$('#playButton').on('click', function(e) {
  e.preventDefault();

  if (!Demo.inProgress) startGame();
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
