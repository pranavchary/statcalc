class Pokemon {
  constructor(pokemonID, natDexNumber, name, hp, atk, def, spAtk, spDef, spd, imageID) {
    this.pokemonID = pokemonID;
    this.natDexNumber = natDexNumber;
    this.name = name;
    this.stats = {
      hp,
      atk,
      def,
      spAtk,
      spDef,
      spd
    },
    this.imageID = imageID || 0;
  }
};

Object.freeze(Pokemon);

module.exports = Pokemon;
