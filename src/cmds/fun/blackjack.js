// fun_blackjack.js
let Pokedex;
import('pokedex-promise-v2').then(PokedexModule => {
  Pokedex = new PokedexModule.default();
});

const fun_blackjack = {
  name: "blackjack",
  description: "Play a game of blackjack.",
  call: ["blackjack", "bj"],
  usage: "blackjack <start|hit|stay|join>",
  execute: (bot, cmd, args, msg) => {
    const game = bot.gameHandler.getGame(msg.channel.id, 'blackjack');
    if (!game) {
      if (args[0] === 'start') {
        const deck = shuffleDeck();
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];
        bot.gameHandler.startGame(msg.channel.id, 'blackjack', {
          deck,
          playerHand,
          dealerHand,
          users: new Set([msg.author.id]),
        }, 'singleplayer');
        msg.channel.send(`Your hand: ${handToString(playerHand)}\nDealer's hand: ${handToString(dealerHand)}`);
      } else {
        msg.channel.send("You need to start a game first! Use `blackjack start`.");
      }
    } else {
      if (args[0] === 'join' && game.mode === 'multiplayer') {
        game.users.add(msg.author.id);
        msg.channel.send(`${msg.author.username} has joined the game of blackjack.`);
      } else if (game.users.has(msg.author.id)) {
        if (args[0] === 'hit') {
          game.playerHand.push(game.deck.pop());
          msg.channel.send(`Your hand: ${handToString(game.playerHand)}`);
          checkForBust(bot, msg);
        } else if (args[0] === 'stay') {
          const playerValue = calculateHandValue(game.playerHand);
          const dealerValue = calculateHandValue(game.dealerHand);
          let result;
          if (dealerValue > playerValue) {
            result = "Dealer wins!";
          } else if (dealerValue < playerValue) {
            result = "You win!";
          } else {
            result = "It's a tie!";
          }
          bot.gameHandler.endGame(msg.channel.id, 'blackjack');
          msg.channel.send(`${result}\nYour hand: ${handToString(game.playerHand)}\nDealer's hand: ${handToString(game.dealerHand)}`);
        } else {
          msg.channel.send("Invalid command! Use `blackjack hit` to draw another card or `blackjack stay` to end your turn.");
        }
      } else {
        msg.channel.send("You're not currently in a game of blackjack. Use `blackjack join` to join the current game.");
      }
    }
  },
};

function shuffleDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handToString(hand) {
  return hand.map((card) => `${card.value}${card.suit}`).join(", ");
}

function checkForBust(bot, msg) {
  const game = bot.gameHandler.getGame(msg.channel.id, 'blackjack');
  const handValue = calculateHandValue(game.playerHand);
  if (handValue > 21) {
    bot.gameHandler.endGame(msg.channel.id, 'blackjack');
    msg.channel.send("Bust! You've exceeded 21. Game over.");
  }
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.value === 'A') {
      value += 11;
      aces++;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += Number(card.value);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

module.exports = { fun_blackjack };
