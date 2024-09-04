$(document).ready(function() {
    // MatchHeight ===================== //
    // $('.Classname').matchHeight();
    // Select Box ===================== //
    $(".select_box").select2({
        minimumResultsForSearch: -1
    });
    // Destination Slider =====================//
    var swiper = new Swiper(".customertrust_slider", {
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: 5,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        0: {
          slidesPerView: 1.8,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1199: {
          slidesPerView: 4,
        },
        1366: {
          slidesPerView: 5,
        }
      }
    });
    // Report Slider =====================//
    var swiper = new Swiper(".report_slider", {
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
    // Breckpoint 991 ===================== // 
    if (parseInt($(window).width()) < 991) {
      // Navbar Button ===================== //
      $(".navbar-toggler").on("click", function() {
        $(document).find(".navbar").slideToggle();
        $(document).find("body").toggleClass('nav_open');
      });
      $(".header_content .navbar .nav .navbar-nav").after($(".header_link"));
    };    
    // Header Sitcky ===================== //
    $(window).scroll(function(){
      var sticky = $('.header'),
          scroll = $(window).scrollTop();
    
      if (scroll >= 100) sticky.addClass('sticky');
      else sticky.removeClass('sticky');
    }); 
     // Sub Menu open ===================== // 
     const buttons = document.querySelectorAll('.product-info-buttons .btn');

      buttons.forEach(button => {
          button.addEventListener('click', function() {
              // Remove 'active' class from all buttons
              buttons.forEach(btn => btn.classList.remove('active'));
              // Add 'active' class to the clicked button
              this.classList.add('active');
          });
      });
});
