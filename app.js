const { App, subtype } = require('@slack/bolt');
const path = require('path');
const { llog } = require('./src/utils');
const { handleTesting, handleAllMessages } = require('./src/bot/handle-messages');

const eventHandler = require('./src/bot/handle-events')

require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
});

global.ROOT_DIR = path.resolve(__dirname);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

app.message(/testing testing/i, handleTesting);
app.message(/.*/, handleAllMessages);
app.event(/.*/, eventHandler.log);
app.event('app_mention', eventHandler.appMention);

(async () => {
  // Start your app
  global.BOT_CONFIG = {channels: [process.env.SLACK_TESTS_CHANNEL]};
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();