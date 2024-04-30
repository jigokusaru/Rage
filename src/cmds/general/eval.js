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
        reject("User not allowed to use this command.");
        return;
      }

      // Get the code to evaluate
      const code = args.join(" ");

      try {
        // Evaluate the code
        const result = await eval(`(async () => { return ${code} })()`);
        if (result !== undefined) {
          msg.channel
            .send(`Result: ${result}`)
            .then(() => resolve())
            .catch((error) => {
              console.error("Error while replying:", error);
              reject(error);
            });
        } else {
          msg.channel
            .send("The evaluated code returned undefined.")
            .then(() => resolve())
            .catch((error) => {
              console.error("Error while replying:", error);
              reject(error);
            });
        }
      } catch (error) {
        msg.channel
          .send(`Error: ${error.message}`)
          .then(() => reject(error))
          .catch((e) => {
            console.error("Error while replying:", e);
            reject(e);
          });
      }
    });
  },
};

module.exports = { general_eval };
