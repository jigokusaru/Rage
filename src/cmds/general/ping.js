const general_ping = {
  name: "ping",
  description: "Check if the bot is responsive and get response time.",
  call: ["ping"],
  usage: "ping",
  execute: (bot, cmd, args, msg) => {
    const startTime = Date.now(); // Capture start time before sending message

    msg.channel.send("Pong! [") // Send message with placeholder for ping time
      .then((sentMessage) => { // Wait for message to be sent before calculating ping
        const endTime = Date.now();
        const pingTime = endTime - startTime;
        sentMessage.edit(`Pong! [${pingTime}ms]`); // Edit the sent message with ping time
      })
      .catch((error) => { // Handle potential errors during message sending
        console.error("Error sending ping response:", error);
        msg.channel.send("Error: Couldn't send pong message.");
      });
  },
};

module.exports = { general_ping };
