(function(window) {
  'use strict';
  
  var document = window.document,
      bodyElement = document.body || document.getElementsByTagName('body')[0];
  
  var defaultSettings = {
    captchaEndpoint: '' // e.g. '/user-app/botdetectcaptcha' or '/user-app/simplebotdetect.php' or '/user-app/BotDetectCaptcha.ashx'
  };
  
  // Polyfill for trim() method
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }
  
  // Helper functions
  var helpers = {
    extend: function(configuredSettings, defaultSettings) {
      var settings = {};
      for (var key in defaultSettings) {
        var settingValue = configuredSettings[key];
        settings[key] = (typeof settingValue === 'undefined') ? defaultSettings[key] : settingValue;
      }
      return settings;
    },
    
    // ajax helper
    ajax: {
      xhr: function() {
        var x = null;
        try { x = new XMLHttpRequest(); return x; } catch (e) {}
        try { x = new ActiveXObject('MSXML2.XMLHTTP.5.0'); return x; } catch (e) {}
        try { x = new ActiveXObject('MSXML2.XMLHTTP.4.0'); return x; } catch (e) {}
        try { x = new ActiveXObject('MSXML2.XMLHTTP.3.0'); return x; } catch (e) {}
        try { x = new ActiveXObject('MSXML2.XMLHTTP'); return x; } catch (e) {}
        try { x = new ActiveXObject('Microsoft.XMLHTTP'); return x; } catch (e) {}
        return x;
      },

      get: function(url, callback) {
        var xhr = this.xhr();
        if (xhr && xhr.readyState === 0) {
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              callback(xhr);
            }
          };
          xhr.open('GET', url, true);
          xhr.send();
        }
      }
    },
    
    parseJson: function(jsonString) {
      var resultObj = null;
      if (typeof(JSON) !== 'undefined' && typeof(JSON.parse) === 'function') {
        resultObj = JSON.parse(jsonString);
      }
      if (!resultObj) {
        resultObj = eval('(' + jsonString + ')');
      }
      return resultObj;
    },
    
    // get configured base url in captcha html
    getBaseUrl: function(captchaHtml) {
      var baseUrl = '';
      var matched = captchaHtml.match(/id=['"]BDC_BaseUrl['"].*value=['"]([^'"]+)/);
      if (matched) {
        baseUrl = matched[1];
      }
      return baseUrl;
    }
    
  };

  // The common functions that will be shared to other javascript frameworks.
  var commonFunctions = {
    // build url with parameters
    buildUrl: function(url, params) {
      var p = [];

      for (var key in params) {
        if (typeof key === 'string') {
          p.push(key + '=' + params[key]);
        }
      }

      var hasParamsPattern = /\?+/g;
      return hasParamsPattern.test(url) ? (url + '&' + p.join('&')) : (url + '?' + p.join('&')); 
    },

    // create script include element
    scriptInclude: function(url, className, onLoadedCallback) {
      var script = document.createElement('script');
          script.src = url;
          script.className = className;
      
      if (script.readyState) { // for IE
        script.onreadystatechange = function() {
          if ((script.readyState === 'loaded') 
                || (script.readyState === 'complete')) {
            if (typeof onLoadedCallback === 'function') {
              onLoadedCallback();
            }
          }
        };
      } else {
        script.onload = function() {
          if (typeof onLoadedCallback === 'function') {
              onLoadedCallback();
            }
        };
      }
      
      return script;
    },

    // Add BotDetect client-side script include to body element.
    addScriptToBody: function(captchaEndpoint, baseUrl, callback) {
      if (document.getElementsByClassName('BDC_ScriptInclude').length !== 0) {
        // BotDetect client-side script is already added
        return;
      }

      // build BotDetect client-side script include url
      var url = this.buildUrl(baseUrl + captchaEndpoint, {
        get: 'script-include'
      });
      
      bodyElement.appendChild(this.scriptInclude(url, 'BDC_ScriptInclude', callback));
    },

    // Add BotDetect init script include to body element.
    addInitScriptToBody: function(captchaStyleName, captchaEndpoint, baseUrl, callback) {
      // remove included BotDetect init script if it exists
      var initScriptIncluded = document.getElementsByClassName('BDC_InitScriptInclude');
      if (initScriptIncluded.length !== 0) {
        initScriptIncluded[0].parentNode.removeChild(initScriptIncluded[0]);
      }

      var captchaId = document.getElementById('BDC_VCID_' + captchaStyleName);

      if (!captchaId) {
        return;
      }

      // build BotDetect init script include url.
      var initScriptIncludeUrl = this.buildUrl(baseUrl + captchaEndpoint, {
        get: 'init-script-include',
        c: captchaStyleName,
        t: captchaId.value,
        cs: '2'
      });

      bodyElement.appendChild(this.scriptInclude(initScriptIncludeUrl, 'BDC_InitScriptInclude', callback));
    }

  };

  // Display captcha html markup in view.
  function displayHtml(settings) {
    // get botdetect-captcha element for showing captcha html
    var bdcElements = document.getElementsByClassName('botdetect-captcha');

    if (bdcElements.length === 0) {
      return;
    }

    // we currently support only one captcha on a page
    var bdcElement = bdcElements[0];

    // captcha style name
    var captchaStyleName = bdcElement.getAttribute('data-stylename');

    if (!captchaStyleName) {
      captchaStyleName = 'defaultCaptcha';
    }

    // save captchaStyleName in window object, that will be used in Captcha.getInstance() for getting BotDetect instance
    window['bdc_clientside_style_name'] = captchaStyleName;

    // build captcha html url
    var captchaHtmlUrl = commonFunctions.buildUrl(settings.captchaEndpoint, {
      get: 'html',
      c: captchaStyleName
    });

    helpers.ajax.get(captchaHtmlUrl, function(response) {
      if (response.status === 200) {
        var captchaHtml = response.responseText;
        var baseUrl = helpers.getBaseUrl(captchaHtml);
        
        var callback = function() {
          bdcElement.innerHTML = captchaHtml.replace(/<script.*<\/script>/g, '');
          // add BotDetect Init script to body
          commonFunctions.addInitScriptToBody(captchaStyleName, settings.captchaEndpoint, baseUrl);
        };
        
        // add BotDetect script to body before displaying Captcha html
        commonFunctions.addScriptToBody(settings.captchaEndpoint, baseUrl, callback);
      } else {
        throw new Error('An error occurred while getting Captcha html markup.');
      }
    });
  }
  
  // Captcha client-side object.
  var Captcha = Captcha || {};
  
  Captcha.config = function(configuredSettings) {
    var settings = helpers.extend(configuredSettings || {}, defaultSettings);

    // remove the '/' last char of url if it exists
    settings.captchaEndpoint = settings.captchaEndpoint.replace(/\/+$/i, '');
    
    // display captcha html markup on the view
    Captcha.init(settings);
  };
  
  Captcha.init = function(settings) {
    Captcha.displayHtml(settings);
  };
  
  Captcha.displayHtml = function(settings) {
    // display Captcha htmt markup when DOM content is loaded
    if (document.readyState === 'complete') {
      displayHtml(settings);
    } else {
      document.onreadystatechange = function() {
        if (document.readyState === "complete") {
          displayHtml(settings);
        }
      };
    }
  };
  
  // Perform UI captcha validation.
  // It will be invoked on blur event by user.
  Captcha.validate = function(callback) {
    var isCorrectCaptcha = false;
    
    var captcha = Captcha.getInstance();

    if (!captcha) {
      throw new Error('BotDetect Captcha client-side instance does not exist.');
    }
    
    var captchaCode = captcha.userInput.value.trim();

    if (captchaCode.length < 1) {
      return;
    }

    var validationUrl = captcha.validationUrl + '&i=' + captchaCode;

    helpers.ajax.get(validationUrl, function(response) {
      if (response.status === 200) {
        isCorrectCaptcha = helpers.parseJson(response.responseText);
        
        // invoke user callback function and fire the validation result through the parameter.
        // so user can use it for either displaying messages or checking captcha code input field status when form is submitted
        callback(isCorrectCaptcha);
        
        // reload captcha image when validation failed
        if (!isCorrectCaptcha) {
          captcha.reloadImage();
        }
      } else {
        throw new Error('An error occurred while validating Captcha.');
      }
    });
  };
  
  Captcha.getInstance = function() {
    var savedCaptchaStyleName = window['bdc_clientside_style_name'];
    
    if (!savedCaptchaStyleName) {
      return null;
    }

    return BotDetect.getInstanceByStyleName(savedCaptchaStyleName);
  };
  
  window.Captcha = Captcha;
}(window));
