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


    $.share_url = function(){
        return location.origin + '/index/viewNote?id=' + location.href.split('#')[0].split('=')[1];
    }

    $.fn.share = function (options) {
        var _w = 32 , _h = 32, pic = '', origin = window.location.origin;


        if (!$(this).hasClass('share_with_status')) {
            pic = origin + $(this).children().attr('src');
        } else {
            pic = $.map($('.share_with_status img'),function (item, index) {
                var $img = $(item);
                return $img.attr('src').indexOf('http') != -1 ? $img.attr('src'): origin + $img.attr('src') ;
            }).join('||')
        }

        var title = '';
        var pre_url =  $.share_url();

        var partial_title = '#' + $('.share-note-type').text().trim() + '#：' + $(".share-title").text().trim() + '［' + $('.share-note-day-count').text().trim() + '天/' + $('.img-box').length + '图］，'

        var pic_anchor = pre_url;

        var is_share_article = true ;
        if (this.children('img').attr('id') != undefined) {
            pic_anchor = pre_url + '#' + this.children('img').attr('id');
            is_share_article = false ;
        }

        if ($($('.current-user-id')[0]).text().trim() == $('.note-author').text().trim()) {
            title += '我在@hi潘多拉网 创建了一篇' + partial_title + '从计划到出行，给你最真实的经历与经验分享，大家赶紧来围观传阅吧～查看戳这里:[ ' + pic_anchor + ' ]';
        } else {
            title += '我发现了一篇很实用的' + partial_title + '并分享给大家！' + pic_anchor + '（分享自@hi潘多拉网 ）';
        }
        var param = {
            url: pre_url + (is_share_article ? '' : '#the_user_item'),
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
            '<div style="position:absolute;top:2px;left:4px;opacity:0;filter:alpha(opacity=0);z-index: 9999">' +
            '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>' +
            '</div>' +
            '<span class="group-item-num sina-share-count" style="position: relative; left:-2px;text-align:center;color: #828282">0</span>' +
            '</div>' +
            '<div class="group-item-weixin group-item-has-num">' +
            '<span class="group-item-num weixin-share-count" style="position: relative; left:-2px;text-align:center;color: #828282">0</span>' +
            '</div>' +
            '<div class="group-item-email-gray"></div>' +
            '<div class="group-item-line"></div>' +
            '<div class="group-item-like"></div>' +
            '</div>';
        if (option.share_with_status) {
            $(share_with_status).appendTo(this).css('position', 'fixed').css('top', $(window).height() / 3).css('left', $('.white-bg').offset().left - 40).show();
        } else {
            $(only_share_content).appendTo(this);
            $($(this.parent().get(0)).parent().get(0)).mouseenter(function () {
                console.log(this)
                $(this).find('.share-pic-container').css({display: 'block', left: option.left, right: option.right, top: option.top, bottom: option.bottom});

            });

            $($(this.parent().get(0)).parent().get(0)).mouseleave(function () {
                $(this).find('.share-pic-container').css('display', 'none');
            });
        }



        return this;
    };
    $.render_share_count = function(){
        function render_sina_share_counts() {
            $.ajax({
                url: 'https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url()) + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                type: "GET",
                dataType: "jsonp",
                success: function (short_url_result, textStatus, xhr) {
                    console.log('------share article count-------');
                    console.log('https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url()) + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E');
                    console.log(short_url_result);
                    $.ajax({
                        url: 'https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                        type: "GET",
                        dataType: "jsonp",
                        success: function (share_count_result, textStatus, xhr) {
                            console.log('https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E');
                            console.log(share_count_result)
                            var article_share_count = share_count_result['data']['urls'][0]['share_counts'];
                            $('.sina-share-count').text(article_share_count);
                            $.cookie('article_share_count', article_share_count,{ path: "/"});
                        },
                        error: function (error) {
                            console.log('获取分享数错误');
                        }

                    });
                },
                error: function (error) {
                    console.log('获取短网址错误');
                }
            })
        }

        function render_total_share_counts(){
            $.ajax({
                url: 'https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url() + '#the_user_item') + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                type: "GET",
                dataType: "jsonp",
                success: function (short_url_result, textStatus, xhr) {
                    console.log('------share total count-------');
                    console.log('https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url() + '#the_user_item') + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E');
                    console.log(short_url_result);
                    $.ajax({
                        url: 'https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                        type: "GET",
                        dataType: "jsonp",
                        success: function (share_count_result, textStatus, xhr) {
                            console.log('https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E');
                            console.log(share_count_result);
                            var pic_share_count = share_count_result['data']['urls'][0]['share_counts'];
                            console.log(pic_share_count)
                            console.log('---');
                            $('.share-total-count').text(parseInt(pic_share_count) + parseInt($.cookie('article_share_count')));
                        },
                        error: function (error) {
                            console.log('获取分享数错误');
                        }

                    });
                },
                error: function (error) {
                    console.log('获取短网址错误');
                }
            });
        }

        render_sina_share_counts();
        render_total_share_counts();

    }


}(jQuery));
