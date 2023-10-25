const OpenAI = require('openai');
const { llog } = require("../../utils");

module.exports = async ({ message, say, client }) => {
    if (message.channel_type == "im") {
      llog.yellow("got a dm and going to do AI stuff with it")
      llog.yellow(message)
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {"role": "system", "content": "You are a helpful assistant that always responds in a series of rhyming couplets no matter how long the response."},
            {"role": "user", "content": message.text},
        ],
      });
    
      console.log(chatCompletion.choices);
      const slackResult = await client.chat.postMessage({
        channel: message.channel,
        text: chatCompletion.choices[0].message.content
      })
    } else {
      llog.magenta("got any old message", message)
    }
  }