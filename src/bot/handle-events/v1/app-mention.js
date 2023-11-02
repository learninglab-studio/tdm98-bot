const OpenAI = require('openai');
const llog = require('../../../utils/ll-logs')
const {director, purple } = require('../../personae')

module.exports = async ({ event, client }) => {
    const finalUserPrompt = `please say whatever you would naturally say to add to this improvised conversation. And if you want to use my name, use the slack handle literally, but your slack handle is <@${process.env.BOT_USER_ID}>, so NEVER use that in a message.`

    llog.yellow(`got an app-mention event: ${event.type}:`, event)
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const messageHistory = await getMessages({ client, event })
    let promptMessages = [
        { 
            role: 'system', 
            content: director.systemPrompt,
        }, ...messageHistory, 
        {role: 'user', content: finalUserPrompt}
    ]
  
    llog.cyan(llog.divider, 'promptMessages', promptMessages)
  
    const chatResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: promptMessages
    });
    llog.magenta(chatResponse);
    const slackResult = await client.chat.postMessage({
        channel: event.channel,
        text: chatResponse.choices[0].message.content,
      //   icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
      //   username: "Director"
        // text: "got some text, but saving secretly in the console"
  
    });
  
  }
  
  const getMessages = async ({ client, event }) => {
    let result = await client.conversations.history({channel: event.channel, limit: 10})
    console.log(result);
    let orderedMessages = result.messages.reverse();
    let tempMessage = { role: 'user', content: '' };
    let theMessages = [];
    orderedMessages.forEach(message => {
        if (message.bot_id && message.user == process.env.BOT_USER_ID) {
            llog.red(`bot message`, message)
            if (tempMessage.content !== '') {
                theMessages.push(tempMessage);
                tempMessage = { role: 'user', content: '' };
            }
            theMessages.push({role: 'assistant', content: message.text});
        } else {
            llog.cyan(`user message`, message)
            tempMessage.content += `\n<@${message.user}>: ${message.text}\n`;
        }
    });

    if (tempMessage.content !== '') {
        theMessages.push(tempMessage);
    }

    return theMessages;
}
