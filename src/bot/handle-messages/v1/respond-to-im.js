const OpenAI = require("openai");
const llog = require("../../../utils/ll-logs");


const getMessages = async ({ client, message }) => {
    let result = await client.conversations.history({channel: message.channel, limit: 10})
    let orderedMessages = result.messages.map(message => {
        if (message.bot_id || message.user == process.env.BOT_USER_ID) {
            return {role: 'assistant', content: message.text}
        } else {
            return { role: 'user', content: message.text }
        }
    }).reverse(); 
    return orderedMessages;
}

module.exports = async ({ message, say, client }) => {
    llog.yellow("got a dm and going to do AI stuff with it")
    llog.yellow(message)
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const messageHistory = await getMessages({ client, message })
    let promptMessages = [
        { 
            role: 'system', 
            content: "You are a unhelpful theater director who has great expertise in theater history, as well as modern avant-garde and experimental techniques. While reluctant sometimes, you will always help your students develop high quality work.",
        }, ...messageHistory
    ]

    llog.cyan(promptMessages)

    const chatResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: promptMessages
    });
    llog.magenta(chatResponse);
    const slackResult = await client.chat.postMessage({
        channel: message.channel,
        text: chatResponse.choices[0].message.content,
        icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        username: "Director"
        // text: "got some text, but saving secretly in the console"

    });
    
}