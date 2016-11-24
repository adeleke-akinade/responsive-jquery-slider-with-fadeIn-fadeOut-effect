"use strict"
$.noConflict();

jQuery(function($) {
  var slideCache = [];
  var sliderInterval = 0;
  var i = 0;
  var markup = "";
  
  $(".slider_container img").each(function(index) {
    // preload images
    slideCache[index] = new Image();
    slideCache[index].src = $(this).attr("src");
    
    // create image navigation buttons
    if(i < 1) {
      markup += $(".buttons").append("<span class=\"slide_counter_" + i + " current_slide_counter\"></span>");
    }
    else {
      markup += $(".buttons").append("<span class=\"slide_counter_" + i + "\"></span>");
    }
    
    i++;
  });
  
  function changeImage(currentSlide, stopSliderInterval, direction, button) {
    if(currentSlide.length > 0) {
      var currentPosition = 0;
      var newPosition = 0;
      var newSlide = {};
      var fadeOut = {};
      
      // stop slide interval
      if(stopSliderInterval) {
        clearInterval(sliderInterval);
      }
      
      // get current slide position
      currentPosition = currentSlide.index() + 1;
      
      if(direction == 'prev') {
        if(currentSlide.prev().length > 0) {
          newSlide = currentSlide.prev();
          newPosition = currentPosition - 1;
        }
        else {
          newSlide = currentSlide.parent('ul').children('li').last();
          newPosition = newSlide.index() + 1;
        }
      }
      else if(direction == "next") {
        if(currentSlide.next().length > 0) {
          newSlide = currentSlide.next();
          newPosition = currentPosition + 1;
        }
        else {
          newSlide = $(".slider_container li").first();
          newPosition = 1;
        }
      }
      else if(direction == "button") {
        newPosition = button.index() + 1;
        newSlide = $(".slider_container li:nth-of-type(" + newPosition + ")");
      }
      
      fadeOut = currentSlide.fadeOut(1000).promise().done(function() {
        currentSlide.removeClass("current_slide");
        newSlide.addClass("current_slide");
        newSlide.fadeIn(1000);
        $(".current_slide_counter").removeClass("current_slide_counter");
        $(".buttons span:nth-of-type(" + currentPosition + ")").removeClass("current_slide_counter");
        $(".buttons span:nth-of-type(" + newPosition + ")").addClass("current_slide_counter");
      });
    }
    else {
      return false;
    }
  }
  
  function slider() {
    changeImage($(".current_slide"), false, "next");
  }
  
  // set interval
  sliderInterval = setInterval(slider, 5000);
  
  // when the next slide button is clicked change image and stop slide interval
  $(".next_slide").click(function() {
    // cancel all queued slider animations
    $('.slider_container li').finish();
    
    // switch pause button with play button
    $(".play_pause i").removeClass("fa-pause").addClass("fa-play");
    
    // change image
    changeImage($(".current_slide"), true, "next");
  });
  
  // when the previous slide button is clicked change image and stop slide interval
  $(".prev_slide").click(function() {
    // cancel all queued slider animations
    $('.slider_container li').finish();
    
    // switch pause button with play button
    $(".play_pause i").removeClass("fa-pause").addClass("fa-play");
    
    
    // change image
    changeImage($(".current_slide"), true, "prev");
  });
  
  // when circle button is clicked
  $(".buttons").on('click', "span", function() {
    // cancel all queued slider animations
    $('.slider_container li').finish();
    
    // switch pause button with play button
    $(".play_pause i").removeClass("fa-pause").addClass("fa-play");
    
    // change image
    changeImage($(".current_slide"), true, "button", $(this));
  });
  
  $(".play_pause i").click(function() {
    if($(this).hasClass("fa-pause")) {
      clearInterval(sliderInterval);
      $(this).removeClass('fa-pause').addClass('fa-play');
    }
    else {
      sliderInterval = setInterval(slider, 5000);
      $(this).removeClass('fa-play').addClass('fa-pause');
    }
  });
});