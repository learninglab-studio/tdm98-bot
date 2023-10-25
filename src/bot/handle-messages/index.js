const { llog } = require("../../utils");
const OpenAI = require('openai');

const handleAllMessages = require('./handle-all-messages')
const handleAllNonBot = require('./handle-all-non-bot')

module.exports.handleTesting = async ({ message, say }) => {
    llog.cyan("got testing testing", message)
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>.`);
}

module.exports.handleBot = async ({ event, message, context }) => {
    llog.cyan("got a bot message", message)
    llog.white("and here's the event", event)
}

module.exports.handleHello = async ({ message, say }) => {
    llog.cyan("got a hello message", message)
    // say() sends a message to the channel where the event was triggered
    await say(`hello yourself, <@${message.user}>.`);
}

module.exports.handleAllMessages = handleAllMessages;
module.exports.handleAllNonBot = handleAllNonBot;