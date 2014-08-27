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
        '<div class="group-item-sina share-group-item group-item-has-num" title="分享到微博">' +
        '<div style="position:absolute;top:2px;left:4px;opacity:0;filter:alpha(opacity=0);z-index: 9999">' +
        '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + 32 + '" height="' + 32 + '"></iframe>' +
        '</div>' +
        '<span class="group-item-num share-group-item sina-share-count" style="position: relative; left:-2px;top:-6px;text-align:center;color: #828282">0</span>' +
        '</div>' +
        '<div class="group-item-weixin share-group-item group-item-has-num" style="" title="分享到微信">' +
        '<span class="group-item-num weixin-share-count" style="position: relative; left:-2px;top:-6px;text-align:center;color: #828282">0</span>' +
        '</div>' +
        '<div class="sticky-popup share-group-item group-item-email-gray share-email-left" title="分享到邮件"></div>' +
        '<div class="group-item-line" title="复制链接"></div>' +
        '<div class="group-item-like" title="喜欢"></div>' +
        '</div>';
      var $share_article = $(share_article);
      $share_article.css(position_options['css']);
      $share_article.appendTo($('body'));
      if (!position_options['like']['like_show']) {
        $('.group-item-line,.group-item-like').hide();
      } else {
        var $like = $(".group-item-like");
        if (position_options['like']['is_liked']) {
          $like.addClass('group-item-liked');
        }
        $like.click(function(event) {
          position_options['like']['like_clikc_callback']();
        });
      }
    }

    function share_email(email_options) {
      // first step

      var share_email_pop_wrapper =
        '<div class="sticky-popup email-share-wrapper email-share-wrapper-left">' +
        '<b class="email-share-left-arrow"></b>' +
        '<a class="email-share-close " href="javascript:{}" >×</a>' +
        '<div class="email-share-header">给你的朋友发送邮件</div>' +
        '<div class="email-input-box">' +
        '<input type="text" class="email-address-self email-validate" placeholder="你的邮箱"/>' +
        '<input type="text" class="email-address-friend email-validate" placeholder="朋友的邮箱（多个邮箱用逗号间隔）"/>' +
        '<textarea type="text" class="email-share-info">' +
        email_options['server_config']['typed_share_content'] +
        '</textarea>' +
        '</div>' +
        '<div class="email-btn-group">' +
        '<a class="btn-white-large">发送</a>' +
        '</div>' +
        '</div>';

      $('.share-email-left').click(function(event) {
        if ($(".email-share-wrapper-left").length == 0) {
          $('.email-share-wrapper').remove();
          var $share_email_pop_wrapper = $(share_email_pop_wrapper);
          $share_email_pop_wrapper.css(email_options['css']);
          $share_email_pop_wrapper.appendTo($('.share-article-container'));
          $('.email-validate').val('')
          $('.email-btn-group a').click(function() {
            if (!(ShareUtil.is_email($('.email-validate:first').val().trim()) &&
              ShareUtil.is_email($('.email-validate:last').val().trim()) &&
              $('.email-share-info').val().trim().length != 0)) {
              return;
            }
            email_options['data']['from'] = $('.email-address-self').val();
            email_options['data']['tos'] = $('.email-address-friend').val().split(',');
            email_options['data']['input_share_content'] = $('.email-share-info').val();
            $.post('/index/share-content-via-email', {
              data: email_options['data']
            }).done(function(data) {
              var self_email = $.trim($('.email-address-self').val());
              $('.share-email-left').siblings('.email-share-wrapper').remove()
              pop_subscribe_after_share_over_email_block(self_email);
            }).fail(function(data) {
              alert('邮件发送过程中出现问题，我们正在解决！');
            });
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
        '<input type="checkbox" class="receive-some-channel-subscribe-content some-channel-checkbox" subscribe_type = "' + email_options['server_config']['current_subscribe'] + '" />' +
        '<span class="email-checkbox-text some-channel">' + email_options['server_config']['current_subscribe'] + '</span>' +
        '</div>' +
        '<div class="email-num">每周2篇</div>' +
        '</div>' +
        '</div>' +
        '<div class="email-succeed-btn-group">' +
        '<a class="email-deny">不用了</a>' +
        '<a class="btn-white-large continue-receive-subscribe">好的</a>' +
        '</div>';

      function pop_subscribe_after_share_over_email_block(self_email) {
        $subscribe_after_share_over_email = $(subscribe_after_share_over_email);
        $subscribe_after_share_over_email.css(email_options['css']);
        $subscribe_after_share_over_email.find('#continue_receive_subscribe_content').first().html('让我们在' + self_email + '为你推送');
        $subscribe_after_share_over_email.appendTo($('.share-article-container'));
        $('.email-share-close').click(function() {
          $(this).parent().remove();
        });
        $('.email-deny').click(function() {
          $(this).parent().parent().remove();
        });
        $('.continue-receive-subscribe').click(function() {
          var data = {},
            me = this,
            upload_status = true;
          data['email'] = self_email;
          $('.email-checkbox-box :checked').each(function(index, item) {
            data['type'] = $(item).attr('subscribe_type');
            $.post('/subscribe', data).done(function() {
              upload_status = upload_status && true;
            }).fail(function(data) {
              upload_status = upload_status && false;
              console.error(data['responseJSON']['error']['code']);
            });

          }).promise().done(function() {
            if (upload_status) {
              $(me).parent().parent().remove();
              pop_continue_receive_subscribe_success_block();
            } else {
              alert('上传信息失败，请重试');
            }
          });


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
        $continue_receive_subscribe_success.css(email_options['css']).css('top', (parseInt(email_options['css']['top']) + 105) + 'px');
        $continue_receive_subscribe_success.appendTo($('.share-article-container'));
        $('.email-share-close').click(function() {
          $(this).parent().remove();
        });
      }
    }

    function render_sina_share_counts(share_count_option) {
      if (share_count_option['urls'].length == 0) {
        return [];
      }

      var url_longs = '';
      $.each(share_count_option['urls'], function(index, item) {
        url_longs += '&url_long=' + encodeURIComponent(item);
      })
      url_longs = url_longs.substr(1, url_longs.length - 1)
      $.ajax({
        url: 'https://api.weibo.com/2/short_url/shorten.json?' + url_longs + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
        type: "GET",
        dataType: "jsonp",
        success: function(short_url_result, textStatus, xhr) {
          if (!short_url_result['data']['urls']) {
            return;
          }
          var url_shorts = '';
          $.each(short_url_result['data']['urls'], function(index, item) {
            url_shorts += "&url_short=" + encodeURIComponent(item['url_short']);
          })
          url_shorts = url_shorts.substr(1, url_shorts.length - 1);
          $.ajax({
            url: 'https://api.weibo.com/2/short_url/share/counts.json?' + url_shorts + '&access_token=2.00JT793DVzTAUE1549e8542b3w2R8E',
            type: "GET",
            dataType: "jsonp",
            success: function(share_count_result, textStatus, xhr) {
              if (share_count_result['data']['urls']) {
                share_count_option['count_callback'](share_count_result['data']['urls']);
              }
            },
            error: function(error) {
              console.error('获取分享数错误');
            }
          });
        },
        error: function(error) {
          console.error('获取短网址错误');
        }
      })
    }

    render_template_and_weibo(options['position'], options['weibo']);
    share_email(options['email']);
    if (options['weibo']['share_count']) {
      render_sina_share_counts(options['weibo']['share_count']);
    }

  }


  $.fn.share_pic = function(options) {
    var me = this;

    function render_temlate(position_options, weibo_options) {
      var temp = [];
      for (var p in weibo_options['param']) {
        temp.push(p + '=' + encodeURIComponent(weibo_options['param'][p] || ''))
      }
      var share_pic = '<div class="share-group share-container share-pic-container share-pic-container-right" >' +
        '<div class="group-item-sina share-group-item" title="分享到微博">' +
        '<div style="position:absolute;top:0px;left:2px;opacity:0;filter:alpha(opacity=0);">' +
        '<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + 32 + '" height="' + 32 + '"></iframe>' +
        '</div>' +
        '</div>' +
        '<div class="group-item-weixin share-group-item" title="分享到微信"></div>' +
        '<div class="sticky-popup group-item-email share-group-item share-email-right" title="分享到邮件"></div>' +
        '<div class="sticky-popup group-item-link share-group-item" title="复制链接"></div>' +
        '</div>';
      var $share_pic = $(share_pic);

      $share_pic.appendTo(me).css(position_options['css']);
      $(position_options['mouse_listen_base_position']).mouseenter(function() {
        $(this).find('.share-pic-container').show();
      }).mouseleave(function(event) {
        $(this).find('.share-pic-container').hide();
      });
    }

    function share_email(email_options) {
      // first step

      var share_email_pop_wrapper =
        '<div class="sticky-popup email-share-wrapper email-share-wrapper-right">' +
        '<b class="email-share-right-arrow"></b>' +
        '<a class="email-share-close " href="javascript:{}" >×</a>' +
        '<div class="email-share-header">给你的朋友发送邮件</div>' +
        '<div class="email-input-box">' +
        '<input type="text" class="email-address-self email-validate" placeholder="你的邮箱"/>' +
        '<input type="text" class="email-address-friend email-validate" placeholder="朋友的邮箱（多个邮箱用逗号间隔）"/>' +
        '<textarea type="text" class="email-share-info">' +
        email_options['server_config']['typed_share_content'] +
        '</textarea>' +
        '</div>' +
        '<div class="email-btn-group">' +
        '<a class="btn-white-large">发送</a>' +
        '</div>' +
        '</div>';


      var share_pic_node_class = '.' + me.attr('class') + ' ';

      $(share_pic_node_class + ' .share-email-right').click(function(event) {
        if ($(".email-share-wrapper-right").length == 0) {
          $('.email-share-wrapper').remove();
          var $share_email_pop_wrapper = $(share_email_pop_wrapper);
          $share_email_pop_wrapper.css(email_options['css']);
          $share_email_pop_wrapper.appendTo($(share_pic_node_class + ' .share-pic-container-right'));
          $('.email-share-wrapper-right .email-btn-group a').click(function() {
            if (!(ShareUtil.is_email($('.email-validate:first').val().trim()) &&
              ShareUtil.is_email($('.email-validate:last').val().trim()) &&
              $('.email-share-info').val().trim().length != 0)) {
              return;
            }
            email_options['data']['from'] = $('.email-address-self').val();
            email_options['data']['tos'] = $('.email-address-friend').val().split(',');
            email_options['data']['input_share_content'] = $('.email-share-info').val();
            $.post('/index/share-content-via-email', {
              data: email_options['data']
            }).done(function(data) {
              var self_email = $.trim($('.email-address-self').val());
              $(share_pic_node_class + ' .share-email-right').siblings('.email-share-wrapper').remove()
              pop_subscribe_after_share_over_email_block(self_email);
            }).fail(function(data) {
              alert('邮件发送过程中出现问题，我们正在解决！');
            });
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
        '<b class="email-share-right-arrow"></b>' +
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
        '<input type="checkbox" class="receive-some-channel-subscribe-content some-channel-checkbox" subscribe_type = "' + email_options['server_config']['current_subscribe'] + '" />' +
        '<span class="email-checkbox-text some-channel">' + email_options['server_config']['current_subscribe'] + '</span>' +
        '</div>' +
        '<div class="email-num">每周2篇</div>' +
        '</div>' +
        '</div>' +
        '<div class="email-succeed-btn-group">' +
        '<a class="email-deny">不用了</a>' +
        '<a class="btn-white-large continue-receive-subscribe">好的</a>' +
        '</div>';

      function pop_subscribe_after_share_over_email_block(self_email) {
        $subscribe_after_share_over_email = $(subscribe_after_share_over_email);
        $subscribe_after_share_over_email.css(email_options['css']);
        $subscribe_after_share_over_email.find('#continue_receive_subscribe_content').first().html('让我们在' + self_email + '为你推送');
        $subscribe_after_share_over_email.appendTo($(share_pic_node_class + '.share-pic-container-right'));
        $('.email-share-close').click(function() {
          $(this).parent().remove();
        });
        $('.email-deny').click(function() {
          $(this).parent().parent().remove();
        });
        $('.continue-receive-subscribe').click(function() {
          var data = {},
            me = this,
            upload_status = true;
          data['email'] = self_email;
          $('.email-checkbox-box :checked').each(function(index, item) {
            data['type'] = $(item).attr('subscribe_type');
            $.post('/subscribe', data).done(function() {
              upload_status = upload_status && true;
            }).fail(function(data) {
              upload_status = upload_status && false;
              console.error(data['responseJSON']['error']['code']);
            });

          }).promise().done(function() {
            if (upload_status) {
              $(me).parent().parent().remove();
              pop_continue_receive_subscribe_success_block();
            } else {
              alert('上传信息失败，请重试');
            }
          });
        });
      }

      //step three
      var email_success_top = $('.group-item-like').length > 0 ? -86 : -42;
      var continue_receive_subscribe_success =
        '<div class="email-first-share-wrapper" >' +
        '<b class="email-share-right-arrow"></b>' +
        '<a class="email-share-close">×</a>' +
        '<div class="email-share-succeed-header">太棒了！很快你会收到你的第一封邮件。</div>'
      '</div>';

      function pop_continue_receive_subscribe_success_block() {
        $continue_receive_subscribe_success = $(continue_receive_subscribe_success);
        console.log(parseInt(email_options['css']['top']) + 105)
        $continue_receive_subscribe_success.css(email_options['css']).css('top', (parseInt(email_options['css']['top']) + 105) + 'px');
        $continue_receive_subscribe_success.appendTo($(share_pic_node_class + '.share-pic-container-right'));
        $('.email-share-close').click(function() {
          $(this).parent().remove();
        });
      }
    }

    function share_link(link_options) {
      var $share_origin = $('.' + me.attr('class') + ' .share-pic-container-right');
      $('.' + me.attr('class') + ' .group-item-link').click(function(event) {
        var share_link_elem =
          '<div class="sticky-popup copy-link">' +
          '<input class="copy-link-input" type="text" value="' + link_options['src'] + '">' +
          '</div>';
        var $share_link_elem = $(share_link_elem);
        $share_origin.append($share_link_elem);
        var $input = $share_link_elem.find('input');
        $input.select();
        $input.on('copy', function() {
          setTimeout(function() {
            $share_link_elem.remove();
          }, 0);
        });
      });
    }

    render_temlate(options['position'], options['weibo']);
    share_email(options['email']);
    share_link(options['link']);
  }



}(jQuery));

var ShareUtil = (function() {

  var listen_input_for_validate_email = function() {
    var me = this;
    if ($(me).val().trim() == '') {
      return true;
    }
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
    if (email == '') {
      return false;
    }
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
