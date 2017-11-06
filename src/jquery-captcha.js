(function($) {
  'use strict';
  
  $.fn.captcha = function(settings) {
    
    if (this.length === 0) {
      throw new Error('Captcha html element cound not be found.');
    }

    if (!settings || !settings.captchaEndpoint) {
      throw new Error('The captchaEndpoint option is required.');
    }
    
    // normalize captcha endpoint path
    settings.captchaEndpoint = settings.captchaEndpoint.replace(/\/+$/g, '');
    
    var styleName = this.data('stylename') ? this.data('stylename') : 'defaultCaptcha';

    // get captcha html markup
    function _getHtml() {
      return $.ajax({
        method: 'GET',
        url: settings.captchaEndpoint,
        data: {
          get: 'html',
          c: styleName
        }
      });
    };
    
    // ajax validate captcha on blur event and trigging the 
    // custom 'validatecaptcha' event to fire the validation result
    function _registerUserInputBlurValidation() {
      var instance = _getInstance();
      if (!instance) { return; }
      
      $('#' + instance.options.userInputID).on('blur', function() {
        var captchaCode = $.trim($(this).val());
        if (captchaCode.length === 0) { return; }

        var self = this;
        $.ajax({
          method: 'GET',
          url: instance.validationUrl,
          data: {
            i: captchaCode
          },
          success: function (isCorrect) {
            if (!isCorrect) {
              instance.reloadImage();
            }
            $(self).trigger('validatecaptcha', [isCorrect]);
          }
        });
      });
    };
    
    // a custom of $.getScript(), which let changing the options
    function _getScript(url, options) {
      options = $.extend({
        dataType: 'script',
        cache: false,
        url: url
      }, options || {});
      return $.ajax(options);
    };
    
    // load botdetect scripts and execute them
    function _loadScriptIncludes() {
      var scriptIncludeUrl = settings.captchaEndpoint + '?get=script-include';
      _getScript(scriptIncludeUrl, { cache: true }).done(function() {
        var captchaId = $('#BDC_VCID_' + styleName).val();
        var initScriptIncludeUrl = settings.captchaEndpoint + '?get=init-script-include&c=' + styleName + '&t=' + captchaId + '&cs=2';
        _getScript(initScriptIncludeUrl).done(_onLoadScriptsSuccess);
      });
    };
    
    // fire the custom event when botdetect scripts are loaded
    function _onLoadScriptsSuccess() {
      _registerUserInputBlurValidation();
    }
    
    // get botdetect captcha client-side instance
    function _getInstance() {
      return (window.BotDetect !== undefined) 
        ? window.BotDetect.getInstanceByStyleName(styleName)
        : null;
    };
    
    // plugin initialization - we display the captcha html markup in view
    this.init = function() {
      var element = this;
      _getHtml(settings.captchaEndpoint, styleName).done(function(captchaHtml) {
        // display captcha html markup
        element.html(captchaHtml.replace(/<script.*<\/script>/g, ''));
        // load botdetect scripts
        _loadScriptIncludes();
        
      });
      return this;
    };
    
    // captcha id for validating captcha at server-side
    this.getCaptchaId = function() {
      var instance, id = null;
      if ((instance = _getInstance())) {
        return instance.captchaId;
      }
      return id;
    };
    
    // reload new captcha image
    this.reloadImage = function() {
      var instance = _getInstance();
      if (instance) {
        instance.reloadImage();
      }
    };

    return this.init();
  };
  
}(jQuery));
