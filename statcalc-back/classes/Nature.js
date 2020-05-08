class Nature {
  constructor(natureID, name, hinderStatID, boostStatID) {
    this.natureID = natureID;
    this.name = name;
    this.hinderStatID = hinderStatID || 0;
    this.boostStatID = boostStatID || 0;
  }
};

Object.freeze(Nature);

module.exports = Nature;
