$(document).ready(function(){
  UIkit.modal.dialog("<button class='uk-modal-close-default' type='button' uk-close></button><div class='uk-modal-header'><h2 class='uk-modal-title'>Welcome to Hangulo!</h2><div><p>Hangulo is currently under development and not fully functional.</p><p>Any questions can be mailed to <span class='uk-text-primary'>joseph@hangulo.org</span></p>", {center:true});
});

$('#word-list li').click(function(e) {
    e.preventDefault()

    $that = $(this);

    $that.parent().find('li').removeClass('uk-active');
    $that.addClass('uk-active');
});
