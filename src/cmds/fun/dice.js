const fun_dice = {
  name: "dice",
  description: "Roll dice according to the provided notation.",
  call: ["roll", "dice"],
  usage: "roll <dice notation>",
  execute: (bot, cmd, args, msg) => {
    // Function to roll a single dice with given sides
    const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

    // Function to parse dice notation and roll dice
    const parseAndRollDice = (notation) => {
      // Regular expression to match dice notation
      const diceRegex = /(\d+)d(\d+)/gi;

      // Array to store rolls for each set
      const rollSets = [];

      // Roll dice according to notation
      const result = notation.replace(diceRegex, (match, numDice, numSides) => {
        numDice = parseInt(numDice);
        numSides = parseInt(numSides);
        let rollSet = [];

        for (let i = 0; i < numDice; i++) {
          const roll = rollDice(numSides);
          rollSet.push(roll);
        }

        // Push the roll set to the array
        rollSets.push(rollSet);

        // Calculate the total value of the roll set
        const rollTotal = rollSet.reduce((acc, roll) => acc + roll, 0);
        return "(" + rollTotal.toString() + ")";
      });

      return { result, rollSets };
    };

    // Check if dice notation is provided
    if (!args.length) {
      return msg.channel.send("Please provide dice notation to roll.");
    }

    const notation = args.join(""); // Join args before calculation

    // Regular expression to validate dice notation
    const validNotationRegex = /^(\(\s*\d+[dD]\d+(\s*[\+\-\*\/]\s*\d+)?\s*\)|\d+[dD]\d+|\d+|\s*[\+\-\*\/]\s*)*$/
    ;

    // Check if the notation is valid
    if (!validNotationRegex.test(notation)) {
      return msg.channel.send("Invalid dice notation. Please use a valid dice notation, e.g., 3d6+2.");
    }

    // Parse and roll the dice
    const { result, rollSets } = parseAndRollDice(notation);

    // Calculate the total result after the math is done
    let total = 0;
    try {
      total = eval(result);
    } catch (error) {
      console.error("Error in calculating total:", error);
      return msg.channel.send("An error occurred while calculating the total.");
    }

    // Format the rolls for output
    const formattedRolls = rollSets.map((rollSet) => `[${rollSet.join(", ")}]`).join(" ");

    msg.channel.send(`Rolls: ${formattedRolls} Total: ${Math.floor(total)}`);
  },
};

module.exports = { fun_dice };
