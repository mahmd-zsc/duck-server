const { getRandomElements, getWordPool } = require("./questionHelpers");

function generateIntroQuestion(word) {
  return {
    _id: word._id,
    type: "intro",
    word: word.word,
    meaning: word.meaning,
    pronunciation: word.pronunciation,
    article: word.article,
    plural: word.plural,
    examples: word.examples,
    synonyms: word.synonyms,
    antonyms: word.antonyms,
    isReviewed: word.isReviewed,
    answer: word.word,
  };
}

function generateTranslationQuestion(word) {
  const fromLanguage = "arabic";
  const toLanguage = "german";

  const wordType = word.type;
  const wordPool = getWordPool(wordType);

  const correctAnswer = word.word; // الترجمة الألمانية
  const questionWord = word.meaning; // الكلمة بالعربي

  const filteredPool = wordPool.filter((item) =>
    typeof item === "string"
      ? item !== correctAnswer
      : item.word !== correctAnswer
  );

  const shuffled = [...filteredPool].sort(() => 0.5 - Math.random());
  const wrongOptions = shuffled
    .slice(0, 3)
    .map((item) => (typeof item === "string" ? item : item.word));

  const options = [...wrongOptions, correctAnswer].sort(
    () => 0.5 - Math.random()
  );

  const questionText = `ما هي الترجمة الألمانية لكلمة "${questionWord}"؟`;

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "translation",
    question: questionText,
    options,
    answer: correctAnswer,
    meaning: word.meaning,
  };
}

function generateArticleQuestion(word) {
  const articles = ["der", "die", "das"];
  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "article",
    question: `ما المقال الصحيح للكلمة "${word.word}"؟`,
    options: articles,
    answer: word.article,
  };
}

function generatePluralQuestion(word) {
  const allOptions = [word.plural, ...word.incorrectPlurals];
  const shuffledOptions = [...allOptions].sort(() => 0.5 - Math.random());
  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "plural",
    question: `ما هي صيغة الجمع للكلمة "${word.word}"؟`,
    options: shuffledOptions,
    answer: word.plural,
  };
}

function generatePronunciationQuestion(word) {
  const wordPool = getWordPool(word.type);
  const wrongOptions = getRandomElements(wordPool, 3, word.word);
  const allOptions = [...wrongOptions].sort(() => 0.5 - Math.random());

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "pronunciation",
    question: "استمع إلى النطق واختر الكلمة الصحيحة:",
    options: allOptions,
    answer: word.word,
    meaning: word.meaning,
  };
}

function generateWriteTheWordQuestion(word) {
  const fullWord =
    word.article && word.article !== "none"
      ? `${word.article} ${word.word}`
      : word.word;

  const meaningWithArticle =
    word.article && word.article !== "none"
      ? `ال${word.meaning}`
      : word.meaning;

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "writeWord",
    question: `اكتب الكلمة الألمانية التي معناها "${meaningWithArticle}"`,
    answer: fullWord,
    meaning: meaningWithArticle,
  };
}

function generateSynonymQuestion(word) {
  if (!word.synonyms || word.synonyms.length === 0) return null;

  const correctObj =
    word.synonyms[Math.floor(Math.random() * word.synonyms.length)];
  const correctAnswer = correctObj.word;
  const pronunciation = correctObj.pronunciation;

  const wordPool = getWordPool(word.type);

  const wrongOptions = getRandomElements(wordPool, 3, correctAnswer).map(
    (opt) => (typeof opt === "string" ? opt : opt.word)
  );

  const options = [...wrongOptions, correctAnswer].sort(
    () => Math.random() - 0.5
  );

  return {
    _id: word._id,
    pronunciation,
    type: "synonym",
    question: `ما هو مرادف الكلمة "${word.word}"؟`,
    options,
    answer: correctAnswer,
    meaning: word.meaning,
  };
}

function generateAntonymQuestion(word) {
  if (!word.antonyms || word.antonyms.length === 0) return null;

  const correctObj =
    word.antonyms[Math.floor(Math.random() * word.antonyms.length)];
  const correctAnswer = correctObj.word;
  const correctAnswerMeaning = correctObj.meaning;
  const pronunciation = correctObj.pronunciation;

  const wordPool = getWordPool(word.type);

  const wrongOptions = getRandomElements(wordPool, 3, correctAnswer).map(
    (opt) => (typeof opt === "string" ? opt : opt.word)
  );

  const options = [...wrongOptions, correctAnswer].sort(
    () => Math.random() - 0.5
  );

  return {
    _id: word._id,
    pronunciation,
    type: "antonym",
    question: `ما هو عكس الكلمة "${word.word}"؟`,
    options,
    answer: correctAnswer,
    meaning: correctAnswerMeaning,
  };
}

function generateSentenceOrderQuestion(word) {
  if (!word.examples || word.examples.length === 0) return null;

  const example =
    word.examples[Math.floor(Math.random() * word.examples.length)];

  if (!example.sentence || typeof example.sentence !== "string") return null;

  const words = example.sentence.trim().split(" ");
  const shuffledWords = [...words].sort(() => 0.5 - Math.random());

  return {
    _id: word._id,
    type: "sentenceOrder",
    words: shuffledWords,
    answer: words.join(" "),
    meaning: example.meaning,
    pronunciation: example.pronunciation,
  };
}

function generateWriteSentenceQuestion(word) {
  if (!word.examples || word.examples.length === 0) return null;

  const example =
    word.examples[Math.floor(Math.random() * word.examples.length)];

  if (!example.sentence || !example.meaning) return null;

  return {
    _id: word._id,
    pronunciation: example.pronunciation,
    type: "writeSentence",
    question: `اكتب الجملة الألمانية التي معناها: "${example.meaning}"`,
    answer: example.sentence.trim(),
  };
}

function generateFillInTheBlanksQuestion(word) {
  if (!word.conjugation || !word.conjugation.present) return null;

  const pronouns = [
    "ich",
    "du",
    "er",
    "sieShe",
    "es",
    "wir",
    "ihr",
    "sieThey",
    "Sie",
  ];
  const question = pronouns.map((p) => ({ pronoun: p, answer: "" }));

  const correctAnswers = {
    ich: word.conjugation.present.ich,
    du: word.conjugation.present.du,
    er: word.conjugation.present.er,
    sieShe: word.conjugation.present.sieShe,
    es: word.conjugation.present.es,
    wir: word.conjugation.present.wir,
    ihr: word.conjugation.present.ihr,
    sieThey: word.conjugation.present.sieThey,
    Sie: word.conjugation.present.Sie,
  };

  return {
    _id: word._id,
    type: "fillInTheBlanks",
    verb: word.word,
    question,
    answer: correctAnswers,
  };
}

module.exports = {
  generateIntroQuestion,
  generateTranslationQuestion,
  generateArticleQuestion,
  generatePluralQuestion,
  generatePronunciationQuestion,
  generateWriteTheWordQuestion,
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateSentenceOrderQuestion,
  generateWriteSentenceQuestion,
  generateFillInTheBlanksQuestion,
};
