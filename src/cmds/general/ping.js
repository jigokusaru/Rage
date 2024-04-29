const general_ping = {
  name: "ping",
  description: "Check if the bot is responsive.",
  call: ["ping","p"],
  usage: "ping",
  execute: (bot,cmd,args,msg) => {
    msg.channel.send("Pong!");
  },
};

module.exports = {general_ping}