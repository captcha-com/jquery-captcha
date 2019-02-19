(function($) {
  'use strict';
  
  $.fn.captcha = function(settings) {
    
    var element = this;
    
    if (element.length === 0) {
      throw new Error('Captcha html element cound not be found.');
    }

    if (!settings || !settings.captchaEndpoint) {
      throw new Error('The captchaEndpoint setting is required.');
    }
    
    // normalize captcha endpoint path
    settings.captchaEndpoint = settings.captchaEndpoint.replace(/\/+$/g, '');
    
    var captchaStyleName = _getCaptchaStyleName();
  
    // get captcha style name
    function _getCaptchaStyleName() {
      var styleName;

      styleName = element.data('captchastylename');
      if (styleName) {
        return styleName;
      }

      // backward compatibility
      styleName = element.data('stylename');
      if (styleName) {
        return styleName;
      }

      throw new Error('The data-captchastylename attribute is not found or its value is not set.');
    };
    
    // get captcha html markup
    function _getHtml() {
      return $.ajax({
        method: 'GET',
        url: settings.captchaEndpoint,
        data: {
          get: 'html',
          c: captchaStyleName
        }
      });
    };

    // ajax validate captcha
    function _validateUnsafe(captchaCode, onSuccess) {
      var instance = _getInstance();

      $.ajax({
        method: 'GET',
        url: instance.validationUrl,
        data: {
          i: captchaCode
        },
        success: function (isCorrect) {
          onSuccess(isCorrect);
        }
      });
    };
    
    // ajax validate captcha on blur event and trigging the 
    // custom 'validatecaptcha' event to fire the validation result
    function _registerUserInputBlurValidation() {
      var instance = _getInstance();

      $('#' + instance.options.userInputID).on('blur', function() {
        var captchaCode = $.trim($(this).val());
        if (captchaCode.length === 0) { return; }

        var userInputID = this;
        _validateUnsafe(captchaCode, function(isCorrect) {
          if (!isCorrect) {
            instance.reloadImage();
          }
          $(userInputID).trigger('validatecaptcha', [isCorrect]);
        });
      });
    };
    
    // a custom of $.getScript(), which lets changing the options
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
      var captchaId = $('#BDC_VCID_' + captchaStyleName).val();
      var scriptIncludeUrl = settings.captchaEndpoint + '?get=script-include&c=' + captchaStyleName + '&t=' + captchaId + '&cs=2';
      _getScript(scriptIncludeUrl).done(function() {
        setTimeout(_onLoadScriptsSuccess, 200);
      });
    };
    
    // use user input blur validation if the input element has data-correct-captcha attribute
    function _useUserInputBlurValidation() {
      var instance = _getInstance();
      return ($('#' + instance.options.userInputID).attr('data-correct-captcha') !== undefined);
    };
    
    // fire the custom event when botdetect scripts are loaded
    function _onLoadScriptsSuccess() {
      if (_useUserInputBlurValidation()) {
        _registerUserInputBlurValidation();
      }
    }
    
    // get botdetect captcha client-side instance
    function _getInstance() {
      var instance = null;
      if (typeof window.botdetect !== 'undefined') {
        return window.botdetect.getInstanceByStyleName(captchaStyleName);
      }
      return instance;
    };

    // get captcha endpoint handler from configued captchaEndpoint value,
    // the result can be "simple-captcha-endpoint.ashx", "botdetectcaptcha",
    // or "simple-botdetect.php"
    function _getCaptchaEndpointHandler() {
      var splited = settings.captchaEndpoint.split('/');
      return splited[splited.length - 1];
    };

    // get backend base url from configued captchaEndpoint value
    function _getBackendBaseUrl(captchaEndpointHandler) {
      var lastIndex = settings.captchaEndpoint.lastIndexOf(captchaEndpointHandler);
      return settings.captchaEndpoint.substring(0, lastIndex);
    };

    // change relative to absolute urls in captcha html markup
    function _changeRelativeToAbsoluteUrls(originCaptchaHtml) {
      var captchaEndpointHandler = _getCaptchaEndpointHandler();
      var backendUrl = _getBackendBaseUrl(captchaEndpointHandler);

      originCaptchaHtml = originCaptchaHtml.replace(/<script.*<\/script>/g, '');
      var relativeUrls = originCaptchaHtml.match(/(src|href)=\"([^"]+)\"/g);
      
      var relativeUrl, relativeUrlPrefixPattern, absoluteUrl,
          changedCaptchaHtml = originCaptchaHtml;

      for (var i = 0; i < relativeUrls.length; i++) {
        relativeUrl = relativeUrls[i].slice(0, -1).replace(/src=\"|href=\"/, '');
        relativeUrlPrefixPattern = new RegExp(".*" + captchaEndpointHandler);
        absoluteUrl = relativeUrl.replace(relativeUrlPrefixPattern, backendUrl + captchaEndpointHandler);
        changedCaptchaHtml = changedCaptchaHtml.replace(relativeUrl, absoluteUrl);
      }

      return changedCaptchaHtml;
    };
    
    // display captcha html markup in view
    function _displayHtml() {
      _getHtml(settings.captchaEndpoint, captchaStyleName).done(function(captchaHtml) {
        captchaHtml = _changeRelativeToAbsoluteUrls(captchaHtml) ;
        element.html(captchaHtml);
        _loadScriptIncludes();
      });
    }
    
    // plugin initialization - we display the captcha html markup in view
    element.init = function() {
      _displayHtml();
      return element;
    };
    
    // captcha id for validating captcha at server-side
    element.getCaptchaId = function() {
      var instance = _getInstance();
      return instance.captchaId;
    };

    // get the user entered captcha code
    // keep this function for backward compatibility
    element.getCaptchaCode = function() {
      var instance = _getInstance();
      return instance.userInput.value;
    };

    element.getUserEnteredCaptchaCode = function() {
      return element.getCaptchaCode();
    };
    
    // reload new captcha image
    element.reloadImage = function() {
      var instance = _getInstance();
      instance.reloadImage();
    };

    // validate captcha on client-side and execute user callback function on ajax success
    element.validateUnsafe = function(callback) {
      var instance = _getInstance();
      var captchaCode = $.trim($('#' + instance.options.userInputID).val());
      _validateUnsafe(captchaCode, function(isHuman) {
        callback(isHuman);
        if (!_useUserInputBlurValidation() && !isHuman) {
          instance.reloadImage();
        }
      });
    };

    return element.init();
  };
  
}(jQuery));
