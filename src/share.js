/*
 * share
 * 
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

(function ($) {

    var SHARE_URL = {
        'note': '/index/viewNote',
        'xiu': '/index/viewXiu',
        'food': '/index/cityFood'
    }

    if(!location.origin) {
        location.origin =  location.protocol + '//' + location.hostname +
            (location.port ? (':' + location.port) : '');
    }

    $.share_url = function(type){
        var id = null;
        if(type == 'food'){
            id =  $('.food_id').text();
        }else{
            id = location.href.split('#')[0].split('=')[1]
        }
        return location.origin + SHARE_URL[type] +'?id='
            + id;
    }

    $.remove_previous_pop = function() {
        $('.email-share-wrapper').remove();
        $('.copy-link').remove();
    };

    $.fn.share = function (options) {
        var _w = 32 , _h = 32, pic = '', origin = window.location.origin;


        if (!$(this).hasClass('share_with_status')) {
            pic = $(this).children().attr('src').indexOf('http') != -1 ? $(this).children().attr('src') : origin + $(this).children().attr('src');
        } else {
            pic = $.map($('.share_with_status img'),function (item, index) {
                var $img = $(item);
                return $img.attr('src').indexOf('http') != -1 ? $img.attr('src'): origin + $img.attr('src') ;
            }).join('||')
        }

        var title = '';
        var pre_url =  $.share_url(options['type']);
        var day_text = '',
            share_count = $('.share-note-day-count').text().trim();
        if( share_count && share_count.length > 0)
            day_text = share_count + '天/'

        var partial_title = '#' + $('.share-note-type').text().trim() + '#：' + $(".share-title").text().trim() + '［' + day_text + $('.img-box').length + '图］，'

        var pic_anchor = pre_url;

        var is_share_article = true ;
        if (this.children('img').attr('id') != undefined) {
            pic_anchor = pre_url + '#' + this.children('img').attr('id');
            is_share_article = false ;
        }
        var share_sentence = '';
        if(options['type'] === 'note') {
            share_sentence = '从计划到出行，给你最真实的经历与经验分享，'
        } else if (options['type'] === 'xiu') {
            share_sentence = '给你最真实的经验分享，'
        }else if(options['type'] == 'food'){
            is_share_article = true ;
        }
        if ($($('.current-user-id')[0]).text().trim() == $('.note-author').text().trim()) {
            title += '我在@hi潘多拉网 创建了一篇' + partial_title + share_sentence + pre_url + (is_share_article ? '' : '#the_user_item') +' 大家赶紧来围观传阅吧～查看戳这里: ' ;
        } else {
            title += '我发现了一篇很实用的' + partial_title + '并分享给大家！' + pre_url + (is_share_article ? '' : '#the_user_item') + '（分享自@hi潘多拉网 ） 查看戳这里: ';
        }
        if(options['type'] == 'food'){
            title = '我发现了一道很棒的' + '#目的地美食#：' + ',并分享给大家！' + pre_url + '（分享自@hi潘多拉网 ） 查看戳这里: ';
        }
        var param = {
            url: pic_anchor,
            type: '1',
            count: '',
            appkey: '1153655536',
            title: title,
            pic: pic,
            ralateUid: '',
            language: 'zh_cn',
            rnd: new Date().valueOf()
        }
        var init_like = function($like_div) {
            $like_div.data('liked', option.liked || 0);
            if( $like_div.data('liked') ) {
                $like_div.addClass('group-item-liked');
            } else {
                $like_div.removeClass('group-item-liked');
            }
            $like_div.on('click', option.like || jQuery.noop);
        }
        var temp = [];
        for (var p in param) {
            temp.push(p + '=' + encodeURIComponent(param[p] || ''))
        }
        var option = $.extend({share_with_status: true, left: 0, right: 0, top: 0, bottom: 0, hide_like_item: false}, options);
        this.addClass('share-origin');
        var only_share_content = '<div class="share-group share-container share-pic-container">' +
            '<div class="group-item-sina">' +
            '<div style="position:absolute;top:0px;left:2px;opacity:0;filter:alpha(opacity=0);">' +
            '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>' +
            '</div>' +
            '</div>' +
            '<div class="group-item-weixin"></div>' +
            '<div class="sticky-popup group-item-email share-email-right"></div>' +
            '<div class="sticky-popup group-item-link group-last-item"></div>' +
            '</div>';
        var share_with_status = '<div class="share-items-group share-container share-article-container">' +
            '<div class="group-item-sina group-item-has-num">' +
            '<div style="position:absolute;top:2px;left:4px;opacity:0;filter:alpha(opacity=0);z-index: 9999">' +
            '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>' +
            '</div>' +
            '<span class="group-item-num sina-share-count" style="position: relative; left:-2px;top:-6px;text-align:center;color: #828282">0</span>' +
            '</div>' +
            '<div class="group-item-weixin group-item-has-num" style="">' +
            '<span class="group-item-num weixin-share-count" style="position: relative; left:-2px;top:-6px;text-align:center;color: #828282">0</span>' +
            '</div>' +
            '<div class="sticky-popup group-item-email-gray share-email-left"></div>' +
            '<div class="group-item-line"></div>' +
            '<div class="group-item-like"></div>' +
            '</div>';
        if (option.share_with_status) {
            var $share_with_status = $(share_with_status);
            if (options.hide_like_item) {
                $share_with_status.addClass('none-like-item');
                $share_with_status.find('.group-item-line').remove();
                $share_with_status.find('.group-item-like').remove();
            }
            $share_with_status.appendTo(this).css('position', 'fixed').css('top', $(window).height() / 3).css('left', $('.white-bg').offset().left - 40).show();
            // init like
            $.share_email($(this), 'left');
            init_like( $(this).find('.group-item-like') );
        } else {
            $(only_share_content).appendTo(this);

            function show_pic_container($elem) {
                $elem.find('.share-pic-container')
                     .css({
                        display: 'block',
                        left: option.left,
                        right: option.right,
                        top: option.top,
                        bottom: option.bottom
                    });
            }

            function hide_pic_container($elem) {
                $elem.find('.share-pic-container').css('display', 'none');
            }

            if(options['type'] === 'note') {
                $($(this.parent().get(0)).parent().get(0)).mouseenter(function () {
                    show_pic_container( $(this) );
                });

                $($(this.parent().get(0)).parent().get(0)).mouseleave(function () {
                    hide_pic_container( $(this) );
                });
            } else if (options['type'] === 'xiu') {
                $(this).on('mouseenter', function() {
                    show_pic_container( $(this) );
                });

                $(this).on('mouseleave', function() {
                    hide_pic_container( $(this) );
                });
            }
            $.share_email($(this), 'right');
            $.share_link($(this), option['type']);
        }
        $.bind_show_hide_share_popup();

        return this;
    };
    $.render_share_count = function(options){
        var type = options['type']
        function render_sina_share_counts(cb) {
            $.ajax({
                url: 'https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url(type)) + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                type: "GET",
                dataType: "jsonp",
                success: function (short_url_result, textStatus, xhr) {
                    $.ajax({
                        url: 'https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                        type: "GET",
                        dataType: "jsonp",
                        success: function (share_count_result, textStatus, xhr) {
                            var article_share_count = share_count_result['data']['urls'][0]['share_counts'];
                            $('.sina-share-count').text(article_share_count);
                            cb(article_share_count);
                        },
                        error: function (error) {
                            console.error('获取分享数错误');
                            cb(0);
                        }

                    });
                },
                error: function (error) {
                    console.error('获取短网址错误');
                    cb(0);
                }
            })
        }

        function render_total_share_counts(article_share_count){
            $.ajax({
                url: 'https://api.weibo.com/2/short_url/shorten.json?url_long=' + encodeURIComponent($.share_url(type) + '#the_user_item') + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                type: "GET",
                dataType: "jsonp",
                success: function (short_url_result, textStatus, xhr) {
                    $.ajax({
                        url: 'https://api.weibo.com/2/short_url/share/counts.json?url_short=' + short_url_result['data']['urls'][0]['url_short'] + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
                        type: "GET",
                        dataType: "jsonp",
                        success: function (share_count_result, textStatus, xhr) {
                            var pic_share_count = share_count_result['data']['urls'][0]['share_counts'];
                            $('.share-total-count').text(parseInt(pic_share_count) + parseInt(article_share_count));
                        },
                        error: function (error) {
                            console.error('获取分享数错误');
                        }

                    });
                },
                error: function (error) {
                    console.error('获取短网址错误');
                }
            });
        }

        render_sina_share_counts(function(num) {
          render_total_share_counts(num);
        });
    }

    $.share_email = function ($share_origin, side) {
      $share_origin.find('.share-email-' + side).click(function () {
        pop_share_email_block(side, this);
      });

      var top = $('.group-item-like').length > 0 ? -190 : -146,
            shared_topic_title = $('.share-note-type').text().trim();


        //share food
        var share_food = false;
        if(location.pathname == '/person/toCreateCityFood'){
            share_food = true;
        }

        // first step
        var share_email_pop_wrapper =
            '<div class="sticky-popup email-share-wrapper" style="position: relative;left: 38px;top: '+ top +'px;background-color: #fff">' +
            '<b></b>' +
            '<a class="email-share-close " href="javascript:{}" >×</a>' +
            '<div class="email-share-header">给你的朋友发送邮件</div>' +
            '<div class="email-input-box">' +
            '<input type="text" class="email-address-self email-validate" placeholder="你的邮箱"/>' +
            '<input type="text" class="email-address-friend email-validate" placeholder="朋友的邮箱（多个邮箱用逗号间隔）"/>' +
            '<textarea type="text" class="email-share-info">' +
                '嘿，我发现了Hi潘多拉这篇有趣的' + shared_topic_title + '，并发送给你。' +
            '</textarea>' +
            '</div>' +
            '<div class="email-btn-group">' +
            '<a class="btn-white-large">发送</a>' +
            '</div>' +
            '</div>';

        function pop_share_email_block(side, opt) {
            if ($('.copy-link').length > 0) {
              $('.copy-link').remove();
            }
            //remove this
            if($(opt).parent().find('.email-share-wrapper').get(0) != undefined) {
                $(opt).parent().find('.email-share-wrapper').get(0).remove();
                return ;
            }

            //remove other right
            if ($('.email-share-right-arrow').length == 1) {
                $('.email-share-right-arrow').parent().remove();
            }

            if (side == 'right') {
                //remove other left
                if ($('.email-share-left-arrow').length == 1) {
                    $('.email-share-left-arrow').parent().remove();
                }

                $(opt).parent().append(share_email_pop_wrapper);
                $('.email-share-wrapper').css('top', '-184px').css('left', '').css('right', '362px');
                $('.email-btn-group a').css('display', 'block');
            } else {
                $('.share-article-container').append(share_email_pop_wrapper);
            }

            jQuery.placeholder.shim({selector:'.email-address-self'});
            jQuery.placeholder.shim({selector:'.email-address-friend'});

            $('.email-share-wrapper b:first-child').addClass('email-share-' + side + '-arrow');

            $('.email-validate').each(function (index, item) {
                $(item).keyup(listen_input_for_validate_email).blur(function() {
                    if(is_email($(item).val().trim())) {
                        $(item).css('border-color', '#d2d2d2');
                    }else{
                        $(item).css('border-color', '#ff0000');
                    }
                });
            });

            $(":text").focus(function () {
                $(this).css('border-color', '#008def');
            });

            $('.email-btn-group a').click(function () {
                if (! (is_email($('.email-validate:first').val().trim()) &&
                    is_email($('.email-validate:last').val().trim()) &&
                    $('.email-share-info').val().trim().length != 0)) {
                    return ;
                }

                var type_url_map = {
                    '旅行手记': '/index/viewNote',
                    '装备秀': '/index/viewXiu',
                    '目的地美食': 'index/cityFood',


                    '旅行手记_save': 'note',
                    '装备秀_save': 'xiu',
                    '目的地美食_save': 'food'
                };

                var article_id = null;
                if(location.pathname == '/person/toCreateCityFood'){
                    article_id =  $('.food_id').text();
                }else{
                    article_id = location.href.split('id=')[1].split('#')[0];
                }

                var data = {};
                data['from'] = $('.email-address-self').val().trim();
                data['tos'] = $('.email-address-friend').val().trim().split(',');
                data['input_share_content'] = $('.email-share-info').val().trim();
                data['title'] = $('.share-title').text().trim();
                data['article_id'] = article_id;
                data['link'] = location.protocol + '//' + location.host + type_url_map[$('.user-tab-item-sel span').text()] + '?id=' + article_id;
                data['pic_url'] = $('.width660:first img').length != 0 ? $('.width660:first img')[0].src : $('.img-box img')[0].src;
                data['type_key'] = type_url_map[$('.user-tab-item-sel span').text() + '_save'] + '_article';

                var me = this;
                if ($(this).parents('.share-container').hasClass('share-pic-container')) {
                    data['link'] = data['link'] + '#' + $($(me).parents('.share-origin')[0]).find('img').attr('id');
                    data['pic_url'] = $($(me).parents('.share-origin')[0]).find('img')[0].src;
                    data['type_key'] =  type_url_map[$('.user-tab-item-sel span').text() + '_save'] + '_pic';
                }

                $.post('/index/share-content-via-email', { data: data }).done(function (data) {
                    pop_subscribe_after_share_over_email_block($.trim($('.email-address-self').val()), side, opt);
                    $($(me).parent().parent().remove());
                }).fail(function (data) {
                        alert('邮件发送过程中出现问题，我们正在解决！');
                    });

            });

            $('.email-share-close').click(function () {
                $(this).parent().remove();
            });

            if(share_food) {
                $('.email-share-wrapper').css('top', '36px').css('right', '160px');
                $('.email-share-wrapper b:first').removeClass().addClass('email-share-top-arrow');
            }

        }

        //second step
        var subscribe_after_share_over_email = ' <div class="sticky-popup email-share-wrapper" style="position: relative;left: 38px;top: '+ top +'px;background-color: #fff">' +
            '<b></b>' +
            '<a class="email-share-close">×</a>' +
            '<div class="email-share-succeed-header">邮件发送成功！</div>' +
            '<div class="email-recommend-tips">' +
            '<span id="continue_receive_subscribe_content">让我们在xxxxxx@xx.com为你推送</span>' +
            '<span>更多内容</span>' +
            '</div>' +
            '<div class="email-checkbox-box">' +
            '<div class="email-source">' +
            '<div class="email-checkbox">' +
            '<input type="checkbox" class="receive-all-website-subscribe-content" subscribe_type = "website"/>' +
            '<span class="email-checkbox-text">hi潘多拉</span>' +
            '</div>' +
            '<div class="email-num">每周7篇</div>' +
            '</div>' +
            '<div class="email-source">' +
            '<div class="email-checkbox">' +
            '<input type="checkbox" class="receive-some-channel-subscribe-content some-channel-checkbox" subscribe_type = "旅行手记" />' +
            '<span class="email-checkbox-text some-channel">旅行手记</span>' +
            '</div>' +
            '<div class="email-num">每周2篇</div>' +
            '</div>' +
            '</div>' +
            '<div class="email-succeed-btn-group">' +
            '<a class="email-deny">不用了</a>' +
            '<a class="btn-white-large continue-receive-subscribe">好的</a>' +
            '</div>';


        function pop_subscribe_after_share_over_email_block(email, side, opt) {
            if (side == 'right') {
                $(opt).parent().append(subscribe_after_share_over_email);
                $('.email-share-wrapper').css('top', '-184px').css('left', '').css('right', '362px');
                $('.email-btn-group a').css('display', 'block');
                $('.email-share-header').css('margin-left', '-194px');
            } else {
                $('.share-article-container').append(subscribe_after_share_over_email);
            }

            $('.email-share-wrapper b:first-child').addClass('email-share-' + side + '-arrow');
            $("#continue_receive_subscribe_content").text('让我们在' + email + '为你推送');
            $(".some-channel").text($('.user-tab-item-sel span').text());
            $(".some-channel-checkbox").attr('subscribe_type', $('.user-tab-item-sel span').text());

            $('.email-share-close').click(function () {
                $(this).parent().remove();
            });
            $('.email-deny').click(function () {
                $(this).parent().parent().remove();
            });

            $('.continue-receive-subscribe').click(function () {
                var data = {}, me = this, upload_status = true;
                data['email'] = email;
                $('.email-checkbox-box :checked').each(function (index, item) {
                    data['type'] = $(item).attr('subscribe_type');
                    $.post('/subscribe', data).done(function () {
                        upload_status = upload_status && true;
                    }).fail(function (data) {
                            upload_status = upload_status && false;
                            console.error(data['responseJSON']['error']['code']);
                        });

                }).promise().done(function () {
                        if (upload_status) {
                            $(me).parent().parent().remove();
                            pop_continue_receive_subscribe_success_block(side, opt);
                        } else {
                            alert('上传信息失败，请重试');
                        }
                    });

            });

            if(share_food) {
                $('.email-share-wrapper').css('top', '36px').css('right', '160px');
                $('.email-share-wrapper b:first').removeClass().addClass('email-share-top-arrow');
            }
        }

        //step three
        var email_success_top = $('.group-item-like').length > 0 ? -86 : -42;
        var continue_receive_subscribe_success =
            '<div class="email-first-share-wrapper" style="position: relative;left: 38px;top: '+ email_success_top +'px;background-color: #fff">' +
            '<b></b>' +
            '<a class="email-share-close">×</a>' +
            '<div class="email-share-succeed-header">太棒了！很快你会收到你的第一封邮件。</div>'
            '</div>';

        function pop_continue_receive_subscribe_success_block(side, opt) {
            if (side == 'right') {
                $(opt).parent().append(continue_receive_subscribe_success);
                $('.email-first-share-wrapper').css('top', '-78px').css('left', '').css('right', '362px');
                $('.email-btn-group a').css('display', 'block');
            } else {
                $('.share-article-container').append(continue_receive_subscribe_success);
            }
            $('.email-first-share-wrapper b:first-child').addClass('email-share-' + side + '-arrow');

            $('.email-share-close').click(function () {
                $(this).parent().remove();
            });
            if(share_food) {
                $('.email-first-share-wrapper').css('top', '36px').css('right', '160px');
                $('.email-first-share-wrapper b:first').removeClass().addClass('email-share-top-arrow');
            }

        }

        function listen_input_for_validate_email() {
            var me = this;
            $.each($(this).val().trim().split(','), function (index, item) {
                if (item.length === 0) {
                    return true;
                }
                if (is_email(item)) {
                    $(me).css('border-color', '#008DDF')
                } else {
                    $(me).css('border-color', '#ff0000')
                }
            });
        }

        function is_email(email) {
            var email_reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
            var status = true ;
            $.each(email.split(','), function (index, item) {
                if (item.length == 0) {
                    return true;
                }
                status = status && email_reg.test(item);
            });
            return  status;
        }
    }
    $.share_link = function ($share_origin, share_type) {
        $share_origin.find('.group-item-link')
            .click(function () {
                pop_share_link_input();
            });

        function pop_share_link_input() {
            $.remove_previous_pop();
            var pic_anchor = $.share_url(share_type) + '#' + $share_origin.find('img').attr('id');
            var share_link_elem =
                '<div class="sticky-popup copy-link">' +
                    '<input class="copy-link-input" type="text" value="' + pic_anchor + '">' +
                    '</div>';
            var $share_link_elem = $(share_link_elem);
            $share_origin.find('.share-group')
                .append($share_link_elem);
            var $input = $share_link_elem.find('input');
            $input.select();
            $input.on('copy', function () {
                setTimeout(function () {
                    $share_link_elem.remove();
                }, 0);
            });

            if(location.pathname=='/person/toCreateCityFood'){
                $share_link_elem.css({
                    top: '31px',
                    right: '10px'
                });
            }

        }
    };

  $.bind_show_hide_share_popup = function () {
    $(document.body).click(function () {
      $.remove_previous_pop();
    });

    $(document.body).on('click', '.sticky-popup', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
  };

}(jQuery));
