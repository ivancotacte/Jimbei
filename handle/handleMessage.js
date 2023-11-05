module.exports = async ({ api, event, config }) => {
    let input = event.body.toLowerCase();
    const { prefix, banned } = config;
    if (input.startsWith(`${prefix}`)) {
      let cmd = input.substring(1);
      cmd = cmd.split(" ");
      if (banned.includes(event.senderID)) {
        return api.sendMessage(
          "You're banned from using commands on this bot!",
          event.threadID,
          event.messageID,
        );
      }
      try {
        if (cmd[0].length === 0) {
          const messages = ["Hello", "Oy", "Wassup", "wassup", "Hey"];
          const message = messages[Math.floor(Math.random() * messages.length)];
          return api.sendMessage(
            {
              body: `${message}`,
            },
            event.threadID,
            event.messageID,
          );
        } else {
          let runIt = require(`../commands/${cmd[0]}`);
          runIt.ivanCOTACTE({
            api,
            event,
            config,
          });
        }
      } catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
          api.sendMessage(
            `The command '${cmd[0]}' is not recognized.`,
            event.threadID,
            event.messageID,
          );
        } else {
          console.log(err);
          api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
        }
      }
    } else {
      try {
        let input = event.body.toLowerCase();
        let cmd = input.split(" ");
        let runIt = require(`../commands/noprefix/${cmd[0]}`);
        runIt({ api, event, config });
      } catch (err) {
        // console.log(err)
        return;
      }
    }
  };