const { PermissionsBitField } = require('discord.js');

const ban_command = {
  name: "ban",
  description: "Ban a user from the server.",
  call: ["ban"],
  usage: "ban <user>",
  execute: async (bot, cmd, args, msg) => {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.BAN_MEMBERS)) {
      return msg.channel.send("You do not have permission to use this command.");
    }

    const target = msg.mentions.members.first();

    if (!target) {
      return msg.channel.send("Please mention the user you want to ban.");
    }

    if (target.id === msg.author.id) {
      return msg.channel.send("You cannot ban yourself.");
    }

    if (!target.bannable) {
      return msg.channel.send("I cannot ban this user.");
    }

    if (msg.member.roles.highest.position <= target.roles.highest.position) {
      return msg.channel.send("You cannot ban a user with an equal or higher role.");
    }

    try{
    await target.ban();
    }catch(error){
     console.error(error);
    }
    msg.channel.send(`User ${target} has been banned.`);
  },
};

module.exports = { ban_command }
