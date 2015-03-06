// add hightlight js
hljs.initHighlightingOnLoad();

$(document).ready(function(){

  $('.m-burger').on('click',function(){
    $(this).toggleClass('m-burger--opened');
  });

  $('.js-z-index > div').on('click',function(){
    $(this).toggleClass('+u-z-5');
  });

  $('.styleguide-utilities.position .\\+u-p-fixed').on('click',function(){
    $(this).hide();
  });

  $(".m-fit-vids").fitVids();

  $(".m-fit-text").fitText();

  $(".m-owl-carousel").owlCarousel({

     //Pagination
    pagination : true,
    paginationNumbers: false,

    //Autoplay
    autoPlay : 3000,
    stopOnHover : true,

    //Auto height
    autoHeight : true,

    singleItem : true,

    goToFirstSpeed : 2000,

    paginationSpeed : 1000,

    // Responsive
    responsive: true,

    //Transitions
    transitionStyle : "fade",

    // Navigation
    navigation : true,
    navigationText : ["prev","next"],

    //Basic Speeds
    slideSpeed : 200,
    paginationSpeed : 800,
    rewindSpeed : 1000,

    // CSS Styles
    baseClass : "m-owl-carousel",
    theme : "m-owl-theme",
  });


  $('.fluidbox').fluidbox();

});