class Stat {
  constructor(statID, name, abbr) {
    this.statID = statID;
    this.name = name;
    this.abbr = abbr;
  }
};

Object.freeze(Stat);

module.exports = Stat;
