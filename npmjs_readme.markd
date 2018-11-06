## BotDetect Captcha jQuery Plugin (BotDetect Captcha Simple API integration for all of the jQuery versions)

### Quick guide:

##### 1) Captcha jQuery Plugin Installation
```sh
npm install jquery-captcha --save
```
##### 2) Include Captcha jQuery Plugin in Your Web App
```html
<script src="node_modules/jquery-captcha/dist/jquery-captcha.min.js"></script>
```
##### 3) Load Captcha jQuery Plugin in Your App, and configure backend Captcha endpoint

Endpoint Configuration depends on which technology you use in the backend.

- ASP.NET-based Captcha endpoint:
```js
$(document).ready(function() {
    // DOM ready
    var captcha = $('#botdetect-captcha').captcha({
      captchaEndpoint: 'captcha-endpoint/BotDetectCaptcha.ashx'
    });
});
```

- Java-based Captcha endpoint:
```js
$(document).ready(function() {
    // DOM ready
    var captcha = $('#botdetect-captcha').captcha({
      captchaEndpoint: 'captcha-endpoint/botdetectcaptcha'
    });
});
```

- PHP-based Captcha endpoint:
```js
$(document).ready(function() {
    // DOM ready
    var captcha = $('#botdetect-captcha').captcha({
      captchaEndpoint: 'captcha-endpoint/simple-botdetect.php'
    });
});
```

##### 4) Display Captcha In Your View
```html
<div id="botdetect-captcha" data-stylename="exampleCaptcha"></div>
```

##### 5) Validate Captcha on the Client-side
- Using validateUnsafe(callback) method to validate Captcha code on form submit:
```js
// On form submit
$('#exampleForm').submit(function(event) {

  captcha.validateUnsafe(function(isCaptchaCodeCorrect) {

    if (isCaptchaCodeCorrect) {
      // Captcha code is correct
    } else {
      // Captcha code is incorrect
    }
    
  });

  event.preventDefault();
});
```

OR

- Using data-correct-captcha directive attribute to validate Captcha code on blur event:
```html
<input 
  type="text" 
  name="captchaCode"
  id="captchaCode"
  data-correct-captcha
>
```

```js
$('#captchaCode').on('validatecaptcha', function(event, isCorrect) {
  if (isCorrect) {
    // UI Captcha validation passed
  } else {
    // UI Captcha validation failed
  }
});
```

##### 6) Validate Captcha on the Server-side
These client-side captcha validations are just an usability improvement that you may use or not -- they do not protect your form from spammers at all.

As you are protecting some server-side action you must validate a Captcha at the server-side before executing that protected action.

- Server-side Captcha validation with [ASP.NET Captcha](https://captcha.com/asp.net-captcha.html#simple-api) looks in this way:
```csharp
// C#
SimpleCaptcha captcha = new SimpleCaptcha();
bool isHuman = captcha.Validate(captchaCode, captchaId);
```
```vbnet
' VB.NET
Dim captcha As SimpleCaptcha = New SimpleCaptcha()
Dim isHuman As Boolean = captcha.Validate(captchaCode, captchaId)
```

- Server-side Captcha validation with [Java Captcha](https://captcha.com/java-captcha.html#simple-api) looks in this way:
```java
SimpleCaptcha captcha = SimpleCaptcha.load(request);
boolean isHuman = captcha.validate(captchaCode, captchaId);
```

- Server-side Captcha validation with [PHP Captcha](https://captcha.com/php-captcha.html#simple-api) looks in this way:
```php
$captcha = new SimpleCaptcha();
$isHuman = $captcha->Validate($captchaCode, $captchaId);
```

### Docs:
 
[jQuery CAPTCHA Integration Guide](https://captcha.com/jquery-captcha.html)

### Code Examples: 
1. [Basic jQuery CAPTCHA Example](https://captcha.com/doc/jquery/examples/jquery-basic-captcha-example.html)

2. [jQuery CAPTCHA Form Example](https://captcha.com/doc/jquery/examples/jquery-form-captcha-example.html)


### Dependencies:
BotDetect Captcha jQuery Plugin requires [BotDetect ASP.NET Captcha](https://captcha.com/asp.net-captcha.html#simple-api), [BotDetect Java Captcha](https://captcha.com/java-captcha.html#simple-api) or [BotDetect PHP Captcha](https://captcha.com/php-captcha.html#simple-api) library to generate Captcha challenges. Simple API support for ASP.NET Core and .NET Core will be released this month -- very likely during the week of 2018/11/19-25. See our [roadmap](https://captcha.com/captcha-roadmap-and-release-notes.html#aspnet-release-notes) for details.


### Technical Support:

Through [contact form on captcha.com](https://captcha.com/contact.html).
