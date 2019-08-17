## BotDetect CAPTCHA jQuery Plugin: Simple API integration for jQuery 1/2/3+

For a comprehensive step-by-step integration guide please see our [jQuery Captcha Plugin Integration Guide](https://captcha.com/jquery-captcha.html).  
The guide covers the integration with the following backends:
- ASP.NET (Core): web API with MVC Core
- ASP.NET (Legacy): Web-API2, MVC1-5, Generic Handler
- Java: Servlet, Spring, Struts
- PHP: the plain PHP

To give you a hint how jQuery Captcha Plugin works we pasted bellow a few, not necessary up-to-date (and mostly frontend related), excerpts from the Integration Guide.

### Quick guide:

##### 1) jQuery Captcha Plugin Installation

```sh
npm install jquery-captcha --save
```

##### 2) Include jQuery Captcha Plugin in Your App

```html
<script src="node_modules/jquery-captcha/dist/jquery-captcha.min.js"></script>
```

##### 3) Load jQuery Captcha Plugin in Your App, and Configure Backend Captcha Endpoint

Endpoint configuration depends on which technology you use in the backend.

- ASP.NET-based captcha endpoint:
```js
$(document).ready(function() {
  // DOM ready
  var captcha = $('#botdetect-captcha').captcha({
    captchaEndpoint: 
      'https://your-app-backend-hostname.your-domain.com/simple-captcha-endpoint.ashx'
  });
});
```

- Java-based captcha endpoint:
```js
$(document).ready(function() {
  // DOM ready
  var captcha = $('#botdetect-captcha').captcha({
    captchaEndpoint: 
      'https://your-app-backend-hostname.your-domain.com/simple-captcha-endpoint'
  });
});
```

- PHP-based captcha endpoint:
```js
$(document).ready(function() {
  // DOM ready
  var captcha = $('#botdetect-captcha').captcha({
    captchaEndpoint: 
      'https://your-app-backend-hostname.your-domain.com/botdetect-captcha-lib/simple-botdetect.php'
  });
});
```

##### 4) Display Captcha In Your View

```html
<div id="botdetect-captcha" data-captchastylename="yourFirstCaptchaStyle"></div>
<input id="yourFirstCaptchaUserInput" type="text"/>
```

##### 5) Captcha Validation: Client-side Code

```js
$('#yourFormWithCaptcha').submit(function(event) {

  // the user-entered captcha code value to be validated at the backend side
  var userEnteredCaptchaCode = captcha.getUserEnteredCaptchaCode();

  // the id of a captcha instance that the user tried to solve
  var captchaId = captcha.getCaptchaId();

  var postData = {
    userEnteredCaptchaCode: userEnteredCaptchaCode,
    captchaId: captchaId
  };

  // post the captcha data to the /your-app-backend-path on your backend
  $.ajax({
    method: 'POST',
    url: 'https://your-app-backend-hostname.your-domain.com/your-app-backend-path',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(postData),
    success: function(response) {
      if (response.success == false) {
        // captcha validation failed; reload image
        captcha.reloadImage();
        // TODO: maybe display an error message, too
      } else {
        // TODO: captcha validation succeeded; proceed with your workflow
      }
    }
  });

  event.preventDefault();
});
```

##### 6) Captcha Validation: Server-side Code

The `userEnteredCaptchaCode` and `captchaId` values posted from the frontend are used to validate a captcha challenge on the backend.

The validation is performed by calling the: `Validate(userEnteredCaptchaCode, captchaId)`.

- Server-side captcha validation with [ASP.NET Captcha](https://captcha.com/asp.net-captcha.html) on backend is executed in the following way:
```csharp
// C#
SimpleCaptcha yourFirstCaptcha = new SimpleCaptcha();
bool isHuman = yourFirstCaptcha.Validate(userEnteredCaptchaCode, captchaId);
```
```vbnet
' VB.NET
Dim yourFirstCaptcha As SimpleCaptcha = New SimpleCaptcha()
Dim isHuman As Boolean = yourFirstCaptcha.Validate(userEnteredCaptchaCode, captchaId)
```

- Server-side captcha validation with [Java Captcha](https://captcha.com/java-captcha.html) on backend is executed in the following way:
```java
SimpleCaptcha yourFirstCaptcha = SimpleCaptcha.load(request);
boolean isHuman = yourFirstCaptcha.validate(userEnteredCaptchaCode, captchaId);
```

- Server-side captcha validation with [PHP Captcha](https://captcha.com/php-captcha.html) on backend is executed in the following way:
```php
$yourFirstCaptcha = new SimpleCaptcha();
$isHuman = $yourFirstCaptcha->Validate($userEnteredCaptchaCode, $captchaId);
```

### Documentation:

1. [jQuery Captcha Plugin Step-by-step Integration Guide](https://captcha.com/jquery-captcha.html) -- read this one first

2. [jQuery Captcha Plugin Basic Example](https://captcha.com/doc/jquery/examples/jquery-basic-captcha-example.html) -- partial code walk-through

3. [jQuery Captcha Plugin Form Example](https://captcha.com/doc/jquery/examples/jquery-form-captcha-example.html) -- partial code walk-through

### Dependencies:

The current version of the jQuery Captcha Plugin requires one of the following BotDetect CAPTCHA backends:
- [ASP.NET v4.4.2+](https://captcha.com/asp.net-captcha.html)
- [Java v4.0.Beta3.7+](https://captcha.com/java-captcha.html)
- [PHP v4.2.5+](https://captcha.com/php-captcha.html)

### Technical Support:

Through contact form on [captcha.com](https://captcha.com/contact.html).