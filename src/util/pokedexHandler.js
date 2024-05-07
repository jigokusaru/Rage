class PokedexHandler {
  constructor() {
    this.pokedex = null;
  }

  async initialize() {
    const PokedexModule = await import("pokedex-promise-v2");
    this.pokedex = new PokedexModule.default();
  }

  getInstance() {
    if (!this.pokedex) {
      throw new Error("Pokedex is not initialized yet");
    }
    return this.pokedex;
  }
}

async function createPokedexHandler() {
  const handler = new PokedexHandler();
  await handler.initialize();
  return handler;
}

module.exports = createPokedexHandler;
