# Shebbak
Shebbak is a simple application fetch new tweets stream for a specific #hashtag, Shebbak is Open Source - introduced as a demo - in a session presented in [CAT Scope'14](http://catreloaded.net). The session was a simple introduction to [AngularJS](http://angularjs.org) but a lot of other technologies integrated along the way like:

* [NodeJS](http://nodejs.org)
* [ExpressJS](http://expressjs.com)
* [OAuth](http://oauth.net/)
* [Jade Template Engine](http://jade-lang.com/)
* [Twitter Bootstrap](http://getbootstrap.com/)

The session presentation can be found on [SlideShare](http://www.slideshare.net/bingorabbit/modern-web-applications-using-angularjs).

For any inquiries, issues or features requests, kindly submit and issue on the github repo.

## Installation
- Clone the repo using:
    `git clone https://github.com/bingorabbit/Shebbak.git`
- That will create a new directory named "Shebbak" in your current working directory, fire:
    `cd Shebbak`
- Use bower to install frontend dependencies
    `bower install`
- Use npm to install backend dependencies
    `npm install`
- Create an application on twitter through [https://apps.twitter.com/](https://apps.twitter.com/)
- Be sure to check `Allow this application to be used to Sign in with Twitter` in the application settings page.
- Rename configs.sample.json to configs.json and fill the following from your twitter application `Keys and Access Tokens` page then save the file.:

```json
        "twitter": {
                      "consumer_key": "Consumer Key (API Key)",
                      "consumer_secret": "Consumer Secret (API Secret)	"
           }
```

- Start the server

    `node server.js`
- You will find the server up and running at [http://localhost:3000](http://localhost:3000) if you want to change the port, you can edit `PORT_LISTENER` in configs.json.