$(document).ready(function(){
    $('#iframe').ready(function() {
         setTimeout(function() {
            $('#iframe').contents().find('#download').remove();
            $('#iframe').contents().find('#print').remove();
         }, 100);

         let buffer = 19.75;
         let successBannerHeight = 66.25;
         let heightToSubtract = buffer;

         logoutButtonHeight = $('#btn-logout').height();

         if ($('#successful-login-message').length > 0) {
            heightToSubtract += successBannerHeight
         }

         heightToSubtract += logoutButtonHeight

         $('#iframe').css('height', $(window).height() - heightToSubtract);
     });
});