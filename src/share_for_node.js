/*
 * share
 *
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

(function($) {
    $.fn.share_article = function(options) {

        function render_template_and_weibo(position_options, weibo_options) {
            var temp = [];
            for (var p in weibo_options['param']) {
                temp.push(p + '=' + encodeURIComponent(weibo_options['param'][p] || ''))
            }
            var share_article = '<div class="share-items-group share-container share-article-container" >' +
                '<div class="group-item-sina group-item-has-num">' +
                '<div style="position:absolute;top:2px;left:4px;opacity:0;filter:alpha(opacity=0);z-index: 9999">' +
                '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + 32 + '" height="' + 32 + '"></iframe>' +
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
            var $share_article = $(share_article);
            $share_article.css(position_options['css'])
            $share_article.appendTo($('body'));
        }

        function share_email(email_options) {
            // first step

            var share_email_pop_wrapper =
                '<div class="sticky-popup email-share-wrapper">' +
                '<b class="email-share-left-arrow"></b>' +
                '<a class="email-share-close " href="javascript:{}" >×</a>' +
                '<div class="email-share-header">给你的朋友发送邮件</div>' +
                '<div class="email-input-box">' +
                '<input type="text" class="email-address-self email-validate" placeholder="你的邮箱"/>' +
                '<input type="text" class="email-address-friend email-validate" placeholder="朋友的邮箱（多个邮箱用逗号间隔）"/>' +
                '<textarea type="text" class="email-share-info">' +
                '嘿，我发现了Hi潘多拉这篇有趣的' + 'shared_topic_title' + '，并发送给你。' +
                '</textarea>' +
                '</div>' +
                '<div class="email-btn-group">' +
                '<a class="btn-white-large">发送</a>' +
                '</div>' +
                '</div>';
            var $share_email_pop_wrapper = $(share_email_pop_wrapper);
            $share_email_pop_wrapper.css(email_options['css']);


            $('.share-email-left').click(function(event) {
                if ($(".email-share-wrapper").length == 0) {
                    $share_email_pop_wrapper.appendTo($('.share-article-container'));
                    $('.email-btn-group a').click(function() {
                        // if (!(ShareUtil.is_email($('.email-validate:first').val().trim()) &&
                        //     ShareUtil.is_email($('.email-validate:last').val().trim()) &&
                        //     $('.email-share-info').val().trim().length != 0)) {
                        //     return;
                        // }
                        // $.post('/index/share-content-via-email', {
                        //     data: email_options['data']
                        // }).done(function(data) {
                        //     pop_subscribe_after_share_over_email_block($.trim($('.email-address-self').val()));
                        //     $($(me).parent().parent().remove());
                        // }).fail(function(data) {
                        //     alert('邮件发送过程中出现问题，我们正在解决！');
                        // });
                        pop_subscribe_after_share_over_email_block($.trim($('.email-address-self').val()));
                        $($(this).parent().parent().remove());
                    });
                    $('.email-share-close').click(function() {
                        $(this).parent().remove();
                    });

                    share_email_pop_wrapper_handler();

                    function share_email_pop_wrapper_handler() {
                        $('.email-validate').each(function(index, item) {
                            $(item).keyup(ShareUtil.listen_input_for_validate_email).blur(function() {
                                if (ShareUtil.is_email($(item).val().trim())) {
                                    $(item).css('border-color', '#d2d2d2');
                                } else {
                                    $(item).css('border-color', '#ff0000');
                                }
                            });
                        });
                    };
                } else {
                    $('.email-share-wrapper').remove();
                }
            });



            //second step
            var subscribe_after_share_over_email = ' <div class="sticky-popup email-share-wrapper" >' +
                '<b class="email-share-left-arrow"></b>' +
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

            function pop_subscribe_after_share_over_email_block() {
                $subscribe_after_share_over_email = $(subscribe_after_share_over_email);
                $subscribe_after_share_over_email.css(email_options['css']);
                $subscribe_after_share_over_email.appendTo($('.share-article-container'));
                $('.email-share-close').click(function() {
                    $(this).parent().remove();
                });
                $('.email-deny').click(function() {
                    $(this).parent().parent().remove();
                });
                $('.continue-receive-subscribe').click(function() {
                    // var data = {}, me = this,
                    //     upload_status = true;
                    // data['email'] = email;
                    // $('.email-checkbox-box :checked').each(function(index, item) {
                    //     data['type'] = $(item).attr('subscribe_type');
                    //     $.post('/subscribe', data).done(function() {
                    //         upload_status = upload_status && true;
                    //     }).fail(function(data) {
                    //         upload_status = upload_status && false;
                    //         console.error(data['responseJSON']['error']['code']);
                    //     });

                    // }).promise().done(function() {
                    //     if (upload_status) {
                    //         $(me).parent().parent().remove();
                    //         pop_continue_receive_subscribe_success_block(side, opt);
                    //     } else {
                    //         alert('上传信息失败，请重试');
                    //     }
                    // });
                    $(this).parent().parent().remove();
                    pop_continue_receive_subscribe_success_block();

                });
            }

            //step three
            var email_success_top = $('.group-item-like').length > 0 ? -86 : -42;
            var continue_receive_subscribe_success =
                '<div class="email-first-share-wrapper" >' +
                '<b class="email-share-left-arrow"></b>' +
                '<a class="email-share-close">×</a>' +
                '<div class="email-share-succeed-header">太棒了！很快你会收到你的第一封邮件。</div>'
            '</div>';

            function pop_continue_receive_subscribe_success_block() {
                $continue_receive_subscribe_success = $(continue_receive_subscribe_success);
                console.log(parseInt(email_options['css']['top']) + 105)
                $continue_receive_subscribe_success.css(email_options['css']).css('top', (parseInt(email_options['css']['top']) + 105) + 'px');
                $continue_receive_subscribe_success.appendTo($('.share-article-container'));
                $('.email-share-close').click(function() {
                    $(this).parent().remove();
                });
            }
        }

        var ShareUtil = (function() {

            var listen_input_for_validate_email = function() {
                var me = this;
                $.each($(me).val().trim().split(','), function(index, item) {
                    if (item.length === 0) {
                        return true;
                    }
                    if (is_email(item)) {
                        $(me).css('border-color', '#008DDF')
                    } else {
                        $(me).css('border-color', '#ff0000')
                    }
                });
            };

            var is_email = function(email) {
                var email_reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
                var status = true;
                $.each(email.split(','), function(index, item) {
                    if (item.length == 0) {
                        return true;
                    }
                    status = status && email_reg.test(item);
                });
                return status;
            };

            return {
                listen_input_for_validate_email: listen_input_for_validate_email,
                is_email: is_email
            }
        }).call(this);

        render_template_and_weibo(options['position'], options['weibo']);
        share_email(options['email']);
    }


    $.fn.share_pic = function(options) {
        function render_temlate(position_options) {
            var param = {
                url: 'http://0.0.0.0:8080/images/uploads/user/2014-05-11/536ef385dbe9b.jpg.535.jpg',
                type: '1',
                count: '',
                appkey: '1153655536',
                title: 'abc',
                pic: 'http://0.0.0.0:8080/images/uploads/user/2014-05-11/536ef385dbe9b.jpg.535.jpg',
                ralateUid: '',
                language: 'zh_cn',
                rnd: new Date().valueOf()
            }
            var temp = [];
            for (var p in param) {
                temp.push(p + '=' + encodeURIComponent(param[p] || ''))
            }
            var share_pic = '<div class="share-group share-container share-pic-container" >' +
                '<div class="group-item-sina">' +
                '<div style="position:absolute;top:0px;left:2px;opacity:0;filter:alpha(opacity=0);">' +
                '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + 32 + '" height="' + 32 + '"></iframe>' +
                '</div>' +
                '</div>' +
                '<div class="group-item-weixin"></div>' +
                '<div class="sticky-popup group-item-email share-email-right"></div>' +
                '<div class="sticky-popup group-item-link"></div>' +
                '</div>';
            var $share_pic = $(share_pic);
            $share_pic.insertAfter($(position_options['ele_insert_after'])).css(position_options['css']);
            $('body').append(share_pic);
            $(position_options['mouse_listen_base_position']).mouseenter(function(){
                $(this).find('.share-pic-container').show();
            }).mouseleave(function(event){
                 $(this).find('.share-pic-container').hide();
            });
        }

        render_temlate(options['position']);

    }



}(jQuery));
