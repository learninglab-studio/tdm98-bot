const OpenAI = require('openai');
const { llog } = require("../../../utils");
// const respondToIm = require('./handle-im');
const {director, purple } = require('../../personae');

module.exports = async ({ message, say, client }) => {
    if (message.channel_type == "im" && (!message.subtype || message.subtype !== 'bot_message')) {
        await respondToIm( { message, say, client });

    } else if (message.subtype || message.subtype == 'bot_message') {
        llog.red(`got a bot message`)
    } else {
        llog.gray("got any old message", message)
    }
}

const respondToIm = async ({ client, message, say }) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    llog.cyan(llog.divider, `SLACK_AI_CONVERSATION_CHANNEL message`, message)
    let result = await client.conversations.history({channel: message.channel, limit: 10})
    llog.magenta(result)
    let messageHistory = result.messages.map(message => {
        if (message.user == process.env.SLACK_BOT_USER_ID) {
            return {role: 'assistant', content: message.text}
        } else {
            return { role: 'user', content: `${message.user} said ${message.text}` }
        }
    }).reverse(); 
    let promptMessages = [
        { 
            role: 'system', 
            content: director.systemPrompt,
        }, ...messageHistory
    ]
    llog.cyan(promptMessages)
    let chatCompletion = await openai.chat.completions.create({
        messages: promptMessages,
        model: 'gpt-3.5-turbo',
        max_tokens: 1000
    });
    let slackResult = await say(chatCompletion.choices[0].message.content);
    return chatCompletion;
    
}
