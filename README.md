# Shebbak
A simple application built with AngularJS, NodeJS and styled with Twitter Bootstrap to fetch new tweets stream for a specific #hashtag.

## Installation
- Clone the repo
- Use bower to install frontend dependencies

    `bower install`
- Use npm to install backend dependencies

    `npm install`
- Create an application on twitter through [https://apps.twitter.com/](https://apps.twitter.com/)
- Be sure to check `Allow this application to be used to Sign in with Twitter` in the application settings page.
- Rename configs.sample.json to configs.json and fill the following from your twitter application `Keys and Access Tokens` page:

    ```json
        "twitter": {
           "consumer_key": "Consumer Key (API Key)",
           "consumer_secret": "Consumer Secret (API Secret)	"
       },```
  Then save the file.
- Start the server

    `node server.js`
- You will find the server up and running at [http://localhost:3000](http://localhost:3000) if you want to change the port, you can edit `PORT_LISTENER` in configs.json.