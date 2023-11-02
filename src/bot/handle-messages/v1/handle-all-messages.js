const OpenAI = require('openai');
const { llog } = require("../../../utils");
const respondToIm = require('./respond-to-im');


module.exports = async ({ message, say, client }) => {
    if (message.channel_type == "im" && (!message.subtype || message.subtype !== 'bot_message')) {
        await respondToIm( { message, say, client });
    } else if (message.subtype || message.subtype == 'bot_message') {
        llog.red(`got a bot message`)
    } else {
        llog.gray("got any old message", message)
    }
}