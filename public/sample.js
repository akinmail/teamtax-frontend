///////////
$(document).ready(() => {
  $('.menu').hover(function() {
    $('.nav-menu').show();
    $('.nav-menu').mouseleave(function() {
     $('.nav-menu').hide();
                              })
  })
  
$('.btn').on('mouseenter', event => {
  $(event.currentTarget).addClass('btn-hover');
  $('.btn')
  }).on('mouseleave', () => {
    $('.btn').removeClass('btn-hover');
});

$('.postText').focus();
  $('.postText').on('keyup', event => {
    let post = $(event.currentTarget).val();
    let remaining = 140 - post.length;
    if (remaining <= 0){
      $('.wordcount').addClass('red');
    } else {
      $('.wordcount').removeClass('red');
    }
    $('.characters').html(remaining);

  });
  
}); 
