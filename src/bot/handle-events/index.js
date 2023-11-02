const { llog } = require('../../utils')
const appMention = require('./v1/app-mention')

exports.log = async ({ event, client }) => {
    llog.cyan(`got an event: ${event.type}:`, event)
}

exports.appMention = appMention;
