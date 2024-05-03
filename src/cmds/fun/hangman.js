// fun_hangman.js
let Pokedex;
import('pokedex-promise-v2').then(PokedexModule => {
  Pokedex = new PokedexModule.default();
});

const fun_hangman = {
  name: "hangman",
  description: "Play a game of hangman with a random Pokemon name.",
  call: ["hangman", "hm"],
  usage: "hangman <start|guess> <letter>",
  async execute(bot, cmd, args, msg) {
    let game = bot.gameHandler.getGame(msg.channel.id, 'hangman');
    if (!game) {
      if (args[0] === 'start') {
        const pokemon = await getRandomPokemon();
        game = {
          word: pokemon,
          guesses: [],
          maxWrongGuesses: 6,
          wrongGuesses: 0,
        };
        bot.gameHandler.startGame(msg.channel.id, 'hangman', game, 'multiplayer');
        msg.channel.send(`Let's play hangman! The word is \n\`\`\`${'_ '.repeat(pokemon.length)}\`\`\``);
      } else {
        msg.channel.send("You need to start a game first! Use `hangman start`.");
      }
    } else {
      if (args[0] === 'guess' && args[1]) {
        // Automatically add the user to the game if they make a guess
        game.users.add(msg.author.id);
        const guess = args[1].toLowerCase();
        game.guesses.push(guess);
        if (!game.word.includes(guess)) {
          game.wrongGuesses++;
        }
        msg.channel.send(`\`\`\`${getGameState(game)}\`\`\``);
        if (game.wrongGuesses >= game.maxWrongGuesses) {
          msg.channel.send(`Oh no, you've lost! The correct word was **${game.word}**.`);
          bot.gameHandler.endGame(msg.channel.id, 'hangman');
        } else if (game.word === guess || !game.word.split('').some(letter => !game.guesses.includes(letter))) {
          msg.channel.send(`Congratulations, you've guessed the word correctly: **${game.word}**! 🎉`);
          bot.gameHandler.endGame(msg.channel.id, 'hangman');
        } else {
          bot.gameHandler.startGame(msg.channel.id, 'hangman', game, 'multiplayer');
        }
      } else {
        msg.channel.send(`\`\`\`${getGameState(game)}\`\`\``);
      }
    }
  },
};

async function getRandomPokemon() {
  const response = await Pokedex.getPokemonsList();
  const pokemons = response.results;
  const randomIndex = Math.floor(Math.random() * pokemons.length);
  return pokemons[randomIndex].name;
}

function getGameState(game) {
  let gameState = '';
  for (const letter of game.word) {
    if (game.guesses.includes(letter)) {
      gameState += letter + ' ';
    } else {
      gameState += '_ ';
    }
  }

  // Add guessed letters
  gameState += '\n\nGuessed letters: ' + game.guesses.join(', ');

  // Add hangman drawing
  const hangmanStages = [
    '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========', // stage 0
    '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========', // stage 1
    '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========', // stage 2
    '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========', // stage 3
    '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========', // stage 4
    '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========', // stage 5
    '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========', // stage 6
  ];
  gameState += '\n\n' + hangmanStages[game.wrongGuesses];

  return gameState;
}

module.exports = { fun_hangman };
