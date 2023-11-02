const OpenAI = require('openai');
const llog = require('../../../utils/ll-logs')

const improviseSlash = async ({ command, ack, client}) => {
    await ack();
    let num = 20;
    if (command.text > 100){
        num = 100;
    }
    else if (100 > command.text > 0){
        num = command.text;
    }
    else {
        num = 20;
    }
    llog.cyan(`a slash command has called for the improv command`, command)
    llog.green(`Number of lines:`, num)
    const blocks = [];
    try {
               const result = await client.chat.postMessage({
                   channel: command.channel_id,
                   text: "working on it",
            })
    } catch (error) {
        llog.red(`couldn't post message in response to moment slash`, error )
    }
    // for (let i = 0; i < num; i++) {
    //     let openAi response = await
    // }
}

module.exports = improviseSlash;

// const improviseSlash = async ({ command, ack, client}) => {
//     await ack();
//     let num = 20;
//     if (command.text > 100){
//         num = 100;
//     }
//     else if (100 > command.text > 0){
//         num = command.text;
//     }
//     else {
//         num = 20;
//     }
//     llog.cyan(`a slash command has called for the improv command`, command)
//     llog.green(`Number of lines:`, num)
//     const blocks = [];
//     try {
//                const result = await client.chat.postMessage({
//                    channel: command.channel_id,
//                    text: "working on it",
//             })
//     } catch (error) {
//         llog.red(`couldn't post message in response to moment slash`, error )
//     }


// }
