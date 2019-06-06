# Picture-Share-App

*Shares Pictures*

This is an app that allows you to create an account to upload and share pictures.

With this app, you can star (i.e like) other users' posts, you can search for specific tags related to images contained in other users' posts, you can search for other users based on different factors (e.g. name, recent activity, etc.), and much more.

...

**Home Page**

<img src="/PS1.PNG" title="home page" alt="home page" width="500px">

**Users Page**

<img src="/PS2.PNG" title="user page" alt="user page" width="500px">

**Account Page**

<img src="/PS3.PNG" title="account page" alt="account page" width="500px">

**Upload Page**

<img src="/PS4.PNG" title="upload page" alt="upload page" width="500px">

**Search Page**

<img src="/PS5.PNG" title="search information" alt="search page" width="500px">

***Full Website (https://literate-sovereign.glitch.me)***


---


## Table of Contents 

> Sections
- [Sample Code](#Sample_Code)
- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [Team](#team)
- [FAQ](#faq)
- [Support](#support)
- [License](#license)


---

## Sample Code

```javascript
// code

       var a=0;
       var timeout;
        
       $(window).scroll(function(){
          
         clearTimeout(timeout);  
         timeout = setTimeout(function() {         
           if((($(document).height()- $(document).scrollTop()) <= $(window).height()*2) && (JSON.parse(val).len>a*10)){
             a++

             $.ajax({
               type: 'POST',
               url: 'https://literate-sovereign.glitch.me/index/load8',
               data: {round: a},
               dataType: 'html',
               success: function(d){
                 d=JSON.parse(d)
                 
                 ...
                 
               }
             })
             
           })
         })
       })
```

---

## Installation


### Setup


>  install npm package

```shell
$ npm install
```

- For all of the packages used, refer to the package.json file [here](/package.json).

---

## Features
## Usage (Optional)
## Documentation (Optional)
## Tests (Optional)
## Contributing
## Team

> Contributors/People

| [**seansangh**](https://github.com/seansangh) |
| :---: |
| [![seansangh](https://avatars0.githubusercontent.com/u/45724640?v=3&s=200)](https://github.com/seansangh)    |
| [`github.com/seansangh`](https://github.com/seansangh) | 

-  GitHub user profile

---

## FAQ

- **Have any *specific* questions?**
    - Use the information provided under *Support* for answers

---

## Support

Reach out to me at one of the following places!

- Twitter at [`@sean13nay`](https://twitter.com/sean13nay?lang=en)
- Github at [`seansangh`](https://github.com/seansangh)

---

## Donations (Optional)

- If you appreciate the code provided herein, feel free to donate to the author via [Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url).

[<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppppcmcvdam.png" alt="Pay with PayPal, PayPal Credit or any major credit card" />](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4VED5H2K8Z4TU&source=url)

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a>S.S.</a>
