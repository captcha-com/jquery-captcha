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
  
  // Ajax helper.
  var ajax = {
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
  };

  // Captcha helper that provides useful functions.
  var captchaHelper = {
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
    scriptInclude: function(url, className) {
      var script = document.createElement('script');
          script.src = url;
          script.className = className;
      return script;
    }
  };

  // Add BotDetect client-side script include to body element.
  function addScriptToBody(captchaEndpoint) {
    if (document.getElementsByClassName('BDC_ScriptInclude').length !== 0) {
      // BotDetect client-side script is already added
      return;
    }

    // build BotDetect client-side script include url
    var url = captchaHelper.buildUrl(captchaEndpoint, {
      get: 'script-include'
    });

    bodyElement.append(captchaHelper.scriptInclude(url, 'BDC_ScriptInclude'));
  }

  // Add BotDetect init script include to body element.
  function addInitScriptToBody(captchaStyleName, captchaEndpoint) {
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
    var initScriptIncludeUrl = captchaHelper.buildUrl(captchaEndpoint, {
      get: 'init-script-include',
      c: captchaStyleName,
      t: captchaId.value,
      cs: '2'
    });

    bodyElement.append(captchaHelper.scriptInclude(initScriptIncludeUrl, 'BDC_InitScriptInclude'));
  }
  
  // Display captcha html markup in view.
  function showHtml(captchaStyleName, bdcElement, captchaEndpoint) {
    // build captcha html url
    var captchaHtmlUrl = captchaHelper.buildUrl(captchaEndpoint, {
      get: 'html',
      c: captchaStyleName
    });

    ajax.get(captchaHtmlUrl, function(response) {
      if (response.status === 200) {
        bdcElement.innerHTML = response.responseText.replace(/<script.*<\/script>/g, '');
        addInitScriptToBody(captchaStyleName, captchaEndpoint);
      } else {
        throw new Error('Can not load captcha html');
      }
    });
  }
  
  var Captcha = Captcha || {};
  
  Captcha.init = function(configuredSettings) {
    var settings = {};
    configuredSettings = configuredSettings || {};
    for (var key in defaultSettings) {
      var settingValue = configuredSettings[key];
      settings[key] = (typeof settingValue === 'undefined') ? defaultSettings[key] : settingValue;
    }

    // remove the '/' last char of url if it exists
    settings.captchaEndpoint = settings.captchaEndpoint.replace(/\/+$/i, '');

    // show captcha html on DOM content loaded
    document.onreadystatechange = function () {
      if (document.readyState === "complete") {
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

        addScriptToBody(settings.captchaEndpoint);
        showHtml(captchaStyleName, bdcElement, settings.captchaEndpoint);
      }
    };
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
