/**
* Template Name: Mentor - v2.1.0
* Template URL: https://bootstrapmade.com/mentor-free-education-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 1;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }
  //Carousel
  /* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * https://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


  +function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: https://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
      var el = document.createElement('bootstrap')

      var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
      }

      for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
          return { end: transEndEventNames[name] }
        }
      }

      return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
      var called = false
      var $el = this
      $(this).one('bsTransitionEnd', function () { called = true })
      var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
      setTimeout(callback, duration)
      return this
    }

    $(function () {
      $.support.transition = transitionEnd()

      if (!$.support.transition) return

      $.event.special.bsTransitionEnd = {
        bindType: $.support.transition.end,
        delegateType: $.support.transition.end,
        handle: function (e) {
          if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
        }
      }
    })

  }(jQuery);

  /* ========================================================================
   * Bootstrap: carousel.js v3.3.5
   * https://getbootstrap.com/javascript/#carousel
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */


  +function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
      this.$element    = $(element)
      this.$indicators = this.$element.find('.carousel-indicators')
      this.options     = options
      this.paused      = null
      this.autoplay    = true
      this.sliding     = null
      this.interval    = null
      this.$active     = null
      this.$items      = null

      this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

      this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
          .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
          .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION  = '3.3.5'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
      if (/input|textarea/i.test(e.target.tagName)) return
      switch (e.which) {
        case 37: this.prev(); break
        case 39: this.next(); break
        default: return
      }

      e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
      e || (this.paused = false)

      this.interval && clearInterval(this.interval)

      this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

      return this
    }

    Carousel.prototype.getItemIndex = function (item) {
      this.$items = item.parent().children('.item')
      return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
      var activeIndex = this.getItemIndex(active)
      var willWrap = (direction == 'prev' && activeIndex === 0)
          || (direction == 'next' && activeIndex == (this.$items.length - 1))
      if (willWrap && !this.options.wrap) return active
      var delta = direction == 'prev' ? -1 : 1
      var itemIndex = (activeIndex + delta) % this.$items.length
      return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
      var that        = this
      var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
      if (activeIndex == pos) return this.pause().cycle()

      return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
      e || (this.paused = true)

      if (this.$element.find('.next, .prev').length && $.support.transition) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }

      this.interval = clearInterval(this.interval)

      return this
    }

    Carousel.prototype.next = function () {
      if (this.sliding) return
      return this.slide('next')
    }

    Carousel.prototype.prev = function () {
      if (this.sliding) return
      return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
      var $active   = this.$element.find('.item.active')
      var $next     = next || this.getItemForDirection(type, $active)
      var isCycling = this.interval
      var direction = type == 'next' ? 'left' : 'right'
      var that      = this

      if ($next.hasClass('active')) return (this.sliding = false)

      var relatedTarget = $next[0]
      var slideEvent = $.Event('slide.bs.carousel', {
        relatedTarget: relatedTarget,
        direction: direction
      })
      this.$element.trigger(slideEvent)
      if (slideEvent.isDefaultPrevented()) return

      this.sliding = true

      isCycling && this.pause()

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
        $nextIndicator && $nextIndicator.addClass('active')
      }

      var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
      if ($.support.transition && this.$element.hasClass('slide')) {
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        $active
            .one('bsTransitionEnd', function () {
              $next.removeClass([type, direction].join(' ')).addClass('active')
              $active.removeClass(['active', direction].join(' '))
              that.sliding = false
              setTimeout(function () {
                that.$element.trigger(slidEvent)
              }, 0)
            })
            .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
      } else {
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger(slidEvent)
      }

      isCycling && this.cycle()

      return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.carousel')
        var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
        var action  = typeof option == 'string' ? option : options.slide

        if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
        if (typeof option == 'number') data.to(option)
        else if (action) data[action]()
        else if (options.interval) data.pause().cycle()
      })
    }

    var old = $.fn.carousel

    $.fn.carousel             = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
      $.fn.carousel = old
      return this
    }


    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
      var href
      var $this   = $(this)
      var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
      if (!$target.hasClass('carousel')) return
      var options = $.extend({}, $target.data(), $this.data())
      var slideIndex = $this.attr('data-slide-to')
      if (slideIndex) options.interval = false

      Plugin.call($target, options)

      if (slideIndex) {
        $target.data('bs.carousel').to(slideIndex)
      }

      e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

    $(window).on('load', function () {
      $('[data-ride="carousel"]').each(function () {
        var $carousel = $(this)
        Plugin.call($carousel, $carousel.data())
      })
    })

  }(jQuery);



  $('.carousel').carousel({
    interval: 0
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1
      },
      900: {
        items: 2
      }
    }
  });

  // Init AOS
  $(window).on('load', function() {
    AOS.init({
      duration: 1000,
      once: true
    });
  });

})(jQuery);