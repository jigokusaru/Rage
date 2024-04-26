module.exports = {
  name: "ping",
  description: "Ping command to check if the bot is responsive.",
  usage: "ping",
  info: "This command is used to check if the bot is online and responsive.",

  execute(msg, args) {
    msg.reply("Pong!"); // Respond with "Pong!"
  },
};
