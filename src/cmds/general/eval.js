const general_eval = {
  name: "eval",
  description: "Evaluate JavaScript code (restricted to specific users).",
  usage: "eval <code>",
  call: ["eval","e"],
  execute: (bot, cmd,args, msg) => {
      // Check if the author's ID matches the allowed IDs
      const allowedUserIds = ["424337832648376333", "113375429414416384"];
      if (!allowedUserIds.includes(msg.author.id)) {
          return;
      }

      console.log(args)
      // Get the code to evaluate
      const code = args.join(" ");
      console.log(code)

      try {
          // Evaluate the code
          const result = eval(code);
          msg.channel.send(`Result: ${result}`).catch(error => {
            console.error('Error while replying:', error);
            // Handle the error here, such as sending a message to notify the user or logging it.
          });
      } catch (error) {
        msg.channel.send(`Error: ${error.message}`).catch(e => {
            console.error('Error while replying:', e);
            // Handle the error here, such as sending a message to notify the user or logging it.
          });;
      }
  },
};

module.exports = {general_eval}