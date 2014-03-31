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

    $.fn.share = function (options) {
        var _w = 32 , _h = 32, pic = '', origin = window.location.origin;


        if (!$(this).hasClass('share_with_status')) {
            pic = origin + $(this).children().attr('src');
        } else {
            pic = $.map($('.img-box'),function (item, index) {
                return origin + $(item).children('img').attr('src')
            }).join('||')
        }

        var title = '';

        var partial_title = '#' + $('.share-note-type').text().trim() + '#：' + $(".share-title").text().trim() + '［' + $('.share-note-day-count').text().trim() + '天/' + $('.img-box').length + '图］，'

        var pic_anchor = location.href;
        if (this.children('img').attr('id') != undefined) {
            pic_anchor = location.href.split('#')[0] + '#' + this.children('img').attr('id');
        }

        if ($($('.current-user-id')[0]).text().trim() == $('.note-author').text().trim()) {
            title += '我在@hi潘多拉网 创建了一篇' + partial_title + '大家赶紧来围观传阅吧～查看戳这里:' + pic_anchor;
        } else {
            title += '我发现了一篇很实用的' + partial_title + '并分享给大家！' + pic_anchor + '（分享自@hi潘多拉网 ）';
        }
        var param = {
            url: location.href,
            type: '1',
            count: '',
            appkey: '1153655536',
            title: title,
            pic: pic,
            ralateUid: '',
            language: 'zh_cn',
            rnd: new Date().valueOf()
        }
        var temp = [];
        for (var p in param) {
            temp.push(p + '=' + encodeURIComponent(param[p] || ''))
        }
        var option = $.extend({share_with_status: true, left: 0, right: 0, top: 0, bottom: 0}, options);
        this.addClass('share-origin');
        var only_share_content = '<div class="share-group share-container share-pic-container">' +
            '<div class="group-item-sina">' +
            '<div style="position:absolute;top:0px;left:2px;opacity:0;filter:alpha(opacity=0);">' +
            '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>' +
            '</div>' +
            '</div>' +
            '<div class="group-item-weixin"></div>' +
            '<div class="group-item-email"></div>' +
            '<div class="group-item-link group-last-item"></div>' +
            '</div>';
        var share_with_status = '<div class="share-items-group share-container share-article-container">' +
            '<div class="group-item-sina group-item-has-num">' +
            '<div style="position:absolute;top:2px;left:4px;opacity:0;filter:alpha(opacity=0);">' +
            '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>' +
            '</div>' +
            '<span class="group-item-num sina-share-count">0</span>' +
            '</div>' +
            '<div class="group-item-weixin group-item-has-num">' +
            '<span class="group-item-num weixin-share-count">0</span>' +
            '</div>' +
            '<div class="group-item-email-gray"></div>' +
            '<div class="group-item-line"></div>' +
            '<div class="group-item-like"></div>' +
            '</div>';
        if (option.share_with_status) {
            $(share_with_status).appendTo(this).css('position', 'fixed').css('top', $(window).height() / 3).css('left', $('.white-bg').offset().left - 40).show();

        } else {
            $(only_share_content).appendTo(this);
        }

        $(this.parent('.content-sub-box.preview-content-sub-box')).mouseenter(function () {
            $(this).find('.share-pic-container').css({display: 'block', left: option.left, right: option.right, top: option.top, bottom: option.bottom});
        });
        $(this.parent('.content-sub-box.preview-content-sub-box')).mouseleave(function () {
            $(this).find('.share-pic-container').css('display', 'none');
        });
        return this;
    };

}(jQuery));
