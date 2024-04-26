const funCommands = [];
const { EmbedBuilder } = require("discord.js");

// Define a deck of cards
const suits = ["♠️", "♡", "♢", "♣️"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

// Function to shuffle the deck
function shuffleDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

// Function to deal a card
function dealCard(deck) {
    return deck.pop();
}

// Blackjack command
const blackJack = {
    name: "blackjack",
    description: "Play a game of blackjack.",
    usage: "blackjack",
    execute: (message) => {
        const deck = shuffleDeck();
        const playerHand = [dealCard(deck), dealCard(deck)];
        const dealerHand = [dealCard(deck), dealCard(deck)];

        const embed = new EmbedBuilder()
            .setTitle("Blackjack")
            .addFields(
                { name: "Your Hand", value: playerHand.join(" ") },
                { name: "Dealer's Hand", value: dealerHand[0] + " ?", inline: true }
            )
            .setColor("#0099ff");

        message.channel.send({ embeds: [embed] });
    },
};

funCommands.push(blackJack);

module.exports = funCommands;