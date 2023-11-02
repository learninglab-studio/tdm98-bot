const { llog } = require('../../utils')

exports.log = async ({ event, client }) => {
    llog.cyan(`got an event: ${event.type}:`, event)
}

exports.appMention = async ({ event, client }) => {
  llog.yellow(`got an app-mention event: ${event.type}:`, event)
}
