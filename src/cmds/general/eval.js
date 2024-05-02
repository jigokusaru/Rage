const general_eval = {
  name: "eval",
  description: "Evaluate JavaScript code (restricted to specific users).",
  usage: "eval <code>",
  call: ["eval", "e"],
  execute: async (bot, cmd, args, msg) => {
    return new Promise(async (resolve, reject) => {
      // Check if the author's ID matches the allowed IDs
      const allowedUserIds = ["424337832648376333", "113375429414416384"];
      if (!allowedUserIds.includes(msg.author.id)) {
        resolve("User not allowed to use this command.");
        return;
      }

      // Get the code to evaluate
      const code = args.join(" ");

      try {
        // Evaluate the code and handle promises
        const result = await eval(`(async () => { return ${code} })()`);
        
        // Send the result back to the channel
        msg.channel.send(`Result: ${result}`);
        resolve();
      } catch (error) {
        // If there's an error, send it back to the channel
        msg.channel.send(`Error: ${error.message}`);
        resolve();
      }
    });
  },
};

module.exports = { general_eval };
