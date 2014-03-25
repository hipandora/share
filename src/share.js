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
        var option = $.extend({share_with_status: true, left: 0, right: 0, top: 0, bottom: 0}, options);
        this.addClass('share-origin');
        var only_share_content = '<div class="share-group share-container">'+
                                 '<div class="group-item-sina"></div>'+
                                 '<div class="group-item-weixin"></div>'+
                                 '<div class="group-item-email"></div>'+
                                 '<div class="group-item-link group-last-item"></div>'+
                                 '</div>';
        var share_with_status = '<div class="share-items-group share-container">'+
                                '<div class="group-item-sina group-item-has-num">'+
                                '<span class="group-item-num sina-share-count">0</span>'+
                                '</div>'+
                                '<div class="group-item-weixin group-item-has-num">'+
                                '<span class="group-item-num weixin-share-count">0</span>'+
                                '</div>'+
                                '<div class="group-item-email-gray"></div>'+
                                '<div class="group-item-line"></div>'+
                                '<div class="group-item-like"></div>'+
                                '</div>';
        if (option.share_with_status) {
            $(share_with_status).appendTo(this);
        } else {
            $(only_share_content).appendTo(this);

        }
        this.mouseover(function() {
            $(this).find('.share-container').css({display: 'block', left: option.left, right: option.right, top: option.top, bottom: option.bottom});
        });
        this.mouseleave(function () {
            $(this).find('.share-container').css('display', 'none');
        });
        return this;
    };

}(jQuery));
