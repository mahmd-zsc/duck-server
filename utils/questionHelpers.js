const verbs = require("../words/verbs.json");
const adjectives = require("../words/adjectives.json");
const adverbs = require("../words/adverbs.json");
const nouns = require("../words/nouns.json");
const prepositions = require("../words/prepositions.json");
const Konjunktion = require("../words/Konjunktion.json");
const pronouns = require("../words/pronouns.json");

function getWordPool(type) {
  switch (type) {
    case "verb":
      return verbs;
    case "adjective":
      return adjectives;
    case "adverb":
      return adverbs;
    case "noun":
      return nouns;
    case "preposition":
      return prepositions;
    case "konjunktion":
      return Konjunktion;
    case "pronouns":
      return pronouns;
    default:
      return [];
  }
}

function getRandomElements(array, count, exclude) {
  const filteredArray = array.filter((item) => {
    if (item.meaning !== exclude && item.word !== exclude) {
      return item;
    }
  });

  const shuffled = [...filteredArray].sort(() => 0.5 - Math.random());

  return shuffled
    .slice(0, count)
    .map((item) => (typeof item === "string" ? item : item));
}

module.exports = {
  getRandomElements,
  getWordPool,
};
