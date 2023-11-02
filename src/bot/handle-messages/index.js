const { llog } = require("../../utils");
const OpenAI = require('openai');

const handleAllMessages = require('./v1/handle-all-messages')

module.exports.handleTesting = async ({ message, say }) => {
    llog.cyan("got testing testing", message)
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>.`);
}

module.exports.handleAllMessages = handleAllMessages;
