(function($) {
  "use strict";

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70) // Subtract sticky navbar height (72px)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav',
    offset: 80 // Offset to trigger active class correctly below the sticky header
  });

  // Scroll progress bar calculation
  $(window).on('scroll', function() {
    var docHeight = $(document).height() - $(window).height();
    if (docHeight > 0) {
      var scrollPercent = ($(window).scrollTop() / docHeight) * 100;
      $('.scroll-progress-bar').css('width', scrollPercent + '%');
    }
  });

  // Intersection Observer for scroll reveal animations
  if ('IntersectionObserver' in window) {
    var revealElements = $('.timeline-item, .project-card, .npm-card, .cert-card, .stat-card, .research-card');
    
    // Add the visual class programmatically
    revealElements.addClass('reveal-on-scroll');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05, // Trigger as soon as 5% of the element is visible
      rootMargin: '0px 0px -40px 0px' // Trigger slightly before entering the screen fully
    });

    revealElements.each(function() {
      observer.observe(this);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    $('.timeline-item, .project-card, .npm-card, .cert-card, .stat-card, .research-card').addClass('revealed');
  }

  // Copy email logic
  window.copyEmailToClipboard = function(e) {
    e.preventDefault();
    var email = "contact@janakaedirisinghe.com";
    navigator.clipboard.writeText(email).then(function() {
      var btn = $('.copy-btn');
      var originalTitle = btn.attr('data-original-title') || 'Copy to Clipboard';
      btn.attr('data-original-title', 'Copied! ✓').tooltip('show');
      setTimeout(function() {
        btn.attr('data-original-title', originalTitle).tooltip('handleHide');
      }, 2000);
    }).catch(function(err) {
      console.error('Failed to copy: ', err);
    });
  };

})(jQuery);
