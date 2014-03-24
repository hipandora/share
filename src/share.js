/*
 * share
 * 
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

(function ($) {

  // Collection method.
  $.fn.awesome = function () {
    return this.each(function (i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.awesome = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.awesome.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.awesome.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].awesome = function (elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

    $.fn.share = function(options) {
        var option = $.extend({content: '', left: 0, right: 0, top: 0, bottom: 0}, options);
        this.addClass('share-origin');
        (option.content).addClass('share-container');
        (option.content).appendTo(this);
        this.mouseover(function() {
            $(this).find('.share-group').css({display: 'block', left: option.left, right: option.right, top: option.top, bottom: option.bottom});
        });
        this.mouseleave(function () {
            $(this).find('.share-group').css('display', 'none');
        });
        return this;
    };

}(jQuery));
