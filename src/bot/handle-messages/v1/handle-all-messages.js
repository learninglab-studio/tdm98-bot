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


const aiDialogueResponseV1 = async ({ client, message, say }) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    llog.cyan(llog.divider, `SLACK_AI_CONVERSATION_CHANNEL message`, message)
    let theMessages = await client.conversations.history({channel: message.channel, limit: 20})
    llog.magenta(theMessages)
    let messageHistory = theMessages.map(message => {
        if (message.user == process.env.SLACK_BOT_USER_ID) {
            return {role: 'assistant', content: message.text}
        } else {
            return { role: 'user', content: `${message.user} said ${message.text}` }
        }
    }).reverse(); 
    let promptMessages = [
        { 
            role: 'system', 
            content: `you are a highly professional AI assistant who speaks in the manner of Jeeves from the the Jeeves and Wooster series by P.G. Wodehouse.` 
        }, ...messageHistory
    ]
    llog.cyan(promptMessages)
    let chatCompletion = await openai.chat.completions.create({
        messages: promptMessages,
        model: 'gpt-3.5-turbo-16k',
        max_tokens: 100
    });
    return chatCompletion;
    // let slackResult = await say(openAiResult.choices[0].message.content);
}
