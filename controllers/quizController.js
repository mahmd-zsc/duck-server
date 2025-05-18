const { Lesson } = require("../models/lessonModel");

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

function generateTranslationQuestion(word) {
  const directions = ["german", "arabic"];
  const fromLanguage =
    directions[Math.floor(Math.random() * directions.length)];
  const toLanguage = fromLanguage === "german" ? "arabic" : "german";

  const wordType = word.type;
  const wordPool = getWordPool(wordType);

  const correctAnswer = fromLanguage === "german" ? word.meaning : word.word;
  const questionWord = fromLanguage === "german" ? word.word : word.meaning;

  const filteredPool = wordPool.filter((item) =>
    typeof item === "string"
      ? item !== correctAnswer
      : item.meaning !== correctAnswer
  );

  const shuffled = [...filteredPool].sort(() => 0.5 - Math.random());
  const wrongOptions = shuffled.slice(0, 3);

  const options = [...wrongOptions, correctAnswer].sort(
    () => 0.5 - Math.random()
  );

  const questionText =
    fromLanguage === "german"
      ? `ما معنى الكلمة "${questionWord}"؟`
      : `ما هي الترجمة الألمانية لكلمة "${questionWord}"؟`;

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
  };
}

function generateSynonymQuestion(word) {
  if (!word.synonyms || word.synonyms.length === 0) return null;

  const correctObj =
    word.synonyms[Math.floor(Math.random() * word.synonyms.length)];
  const correctAnswer = correctObj.word;

  const wordPool = getWordPool(word.type);

  const wrongOptions = getRandomElements(wordPool, 3, correctAnswer).map(
    (opt) => (typeof opt === "string" ? opt : opt.word)
  );

  const options = [...wrongOptions, correctAnswer].sort(
    () => Math.random() - 0.5
  );

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
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

  const wordPool = getWordPool(word.type);

  const wrongOptions = getRandomElements(wordPool, 3, correctAnswer).map(
    (opt) => (typeof opt === "string" ? opt : opt.word)
  );

  const options = [...wrongOptions, correctAnswer].sort(
    () => Math.random() - 0.5
  );

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
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
  };
}

/* 🔥 الجديد: سؤال كتابة الجملة */
function generateWriteSentenceQuestion(word) {
  if (!word.examples || word.examples.length === 0) return null;

  const example =
    word.examples[Math.floor(Math.random() * word.examples.length)];

  if (!example.sentence || !example.meaning) return null;

  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "writeSentence",
    question: `اكتب الجملة الألمانية التي معناها: "${example.meaning}"`,
    answer: example.sentence.trim(),
  };
}

/*--------- Helpers ---------*/

function getNumQuestionsByLevel(level) {
  if (level === "beginner") return 6;
  if (level === "intermediate") return 4;
  if (level === "advanced") return 3;
  return 2;
}

const questionGenerators = [
  generateTranslationQuestion,
  generateArticleQuestion,
  generatePluralQuestion,
  generatePronunciationQuestion,
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateSentenceOrderQuestion,
  generateWriteTheWordQuestion,
  generateWriteSentenceQuestion, // ⬅️ أضفناه هنا
];

function canGenerateQuestion(word, generatorName) {
  switch (generatorName) {
    case "generateArticleQuestion":
      return word.type !== "verb" && !!word.article;
    case "generatePluralQuestion":
      return !!word.plural;
    case "generateSynonymQuestion":
      return word.synonyms && word.synonyms.length > 0;
    case "generateAntonymQuestion":
      return word.antonyms && word.antonyms.length > 0;
    case "generateWriteSentenceQuestion":
      return word.examples && word.examples.length > 0;
    default:
      return true;
  }
}

function generateQuestionsForWord(word, level) {
  const numQuestions = getNumQuestionsByLevel(level);
  const usedTypes = new Set();
  const questions = [];
  let attempts = 0;
  const MAX_ATTEMPTS = 30;

  while (questions.length < numQuestions && attempts < MAX_ATTEMPTS) {
    attempts++;
    const randomIndex = Math.floor(Math.random() * questionGenerators.length);
    const generator = questionGenerators[randomIndex];

    if (usedTypes.has(generator.name)) continue;
    if (!canGenerateQuestion(word, generator.name)) continue;

    const question = generator(word);
    if (question) {
      questions.push(question);
      usedTypes.add(generator.name);
    }
  }

  return questions;
}

/*--------- Controller ---------*/

async function GenerateQuizzes(req, res) {
  try {
    const { lessonId, groupSize, groupNumber } = req.query;
    if (!lessonId || !groupSize || !groupNumber) {
      return res.status(400).json({ message: "جميع البراميترز مطلوبة" });
    }

    const lesson = await Lesson.findById(lessonId).populate("words");
    if (!lesson) return res.status(404).json({ message: "الدرس غير موجود" });

    const words = lesson.words;
    if (!words || words.length === 0) {
      return res.status(404).json({ message: "لا توجد كلمات في هذا الدرس" });
    }

    const size = parseInt(groupSize);
    const number = parseInt(groupNumber);

    const groupedWords = [];
    for (let i = 0; i < words.length; i += size) {
      groupedWords.push(words.slice(i, i + size));
    }

    if (number < 1 || number > groupedWords.length) {
      return res.status(400).json({ message: "رقم المجموعة غير موجود" });
    }

    const selectedGroup = groupedWords[number - 1];
    const quizzes = [];
    selectedGroup.forEach((word) => {
      const questions = generateQuestionsForWord(word, word.level);
      quizzes.push(...questions);
    });

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const shuffledQuizzes = shuffleArray(quizzes);
    res.status(200).json(shuffledQuizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدثت مشكلة في السيرفر" });
  }
}

module.exports = GenerateQuizzes;
