const { EmbedBuilder } = require("discord.js");

const fun_pokedex = {
  name: "pokedex",
  description: "Get the info of a Pokémon.",
  call: ["pokedex", "pd"],
  usage: "pokedex <pokemon_name>",
  execute: async (bot, cmd, args, msg) => {
    if (args.length === 0) {
      return msg.channel.send("Please provide the name of a Pokémon.");
    }

    const pokemonName = args[0].toLowerCase();

    try {
      const Pokedex = await import("pokedex-promise-v2");
      const P = new Pokedex.default();
      const response = await P.getPokemonByName(pokemonName);

      // Fetch species data to get gender ratio
      const speciesData = await P.getPokemonSpeciesByName(pokemonName);
      const capture_rate = speciesData.capture_rate;
      const genderRate = speciesData.gender_rate;
      const genderRatio = genderRate >= 0 ? `Male: ${genderRate * 12.5}%\n Female: ${(8 - genderRate) * 12.5}%` : 'Genderless';

      // Fetch evolution chain data
      const evoChainData = await P.getEvolutionChainById(speciesData.evolution_chain.url.split("/")[6]);
      const evoChain = getEvoChain(evoChainData.chain);

      const embed = new EmbedBuilder()
        .setColor("#FF0000") // Shiny Gyarados color
        .setTitle(`${response.name.charAt(0).toUpperCase() + response.name.slice(1)}`)
        .setURL(response.species.url)
        .setImage(response.sprites.front_default)
        .addFields(
          { name: "Type", value: response.types.map((typeInfo) => typeInfo.type.name).join("\n "), inline: true },
          { name: "Abilities", value: response.abilities.map((abilityInfo) => abilityInfo.ability.name).join("\n "), inline: true },
          { name: "Base Stats", value: response.stats.map((statInfo) => `${statInfo.stat.name}: ${statInfo.base_stat}`).join("\n "), inline: true },
          { name: "Gender Ratio", value: genderRatio, inline: true },
          { name: "Capture Rate", value: `${capture_rate}`, inline: true },
          { name: "Height", value: `${response.height / 10} m`, inline: true },
          { name: "Weight", value: `${response.weight / 10} kg`, inline: true },
          { name: "Base Exp", value: `${response.base_experience}`, inline: true },
          { name: "Evolution Line", value: evoChain, inline: true },
        )
        .setFooter({ text: "Data fetched from Pokédex" });

      msg.channel.send({ embeds: [embed] });
    } catch (error) {
      msg.channel.send("An error occurred while fetching the Pokémon data.");
      console.log(error);
    }
  },
};

// Helper function to get a string representation of an evolution chain
function getEvoChain(chain, evoChain = []) {
  evoChain.push(chain.species.name);

  if (chain.evolves_to.length > 0) {
    let evoPaths = chain.evolves_to.map(evo => {
      let chainCopy = [...evoChain]; // create a copy of the current evolution chain
      return getEvoChain(evo, chainCopy); // pass the copy to the recursive call
    });
    return evoPaths.join("\n");
  }

  return evoChain.join(" -> ");
}

module.exports = { fun_pokedex };