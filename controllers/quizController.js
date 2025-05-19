/* ---------- Imports ---------- */
const { Lesson } = require("../models/lessonModel");

const verbs = require("../words/verbs.json");
const adjectives = require("../words/adjectives.json");
const adverbs = require("../words/adverbs.json");
const nouns = require("../words/nouns.json");
const prepositions = require("../words/prepositions.json");
const Konjunktion = require("../words/Konjunktion.json");
const pronouns = require("../words/pronouns.json");

/* ---------- Helpers ---------- */
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

function getRandomElements(arr, count, exclude) {
  const filtered = arr.filter(
    (item) => item.meaning !== exclude && item.word !== exclude
  );
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* ---------- Question Generators ---------- */
function generateReviewReminderQuestion(word) {
  return {
    _id: word._id,
    pronunciation: word.pronunciation,
    type: "reviewReminder",
    question: `\n"${word.word}" = "${word.meaning}"`,
    answer: word.word,
  };
}

function generateTranslationQuestion(word) {
  /* … نفس الكود السابق … */
}
function generateArticleQuestion(word) {
  /* … */
}
function generatePluralQuestion(word) {
  /* … */
}
function generatePronunciationQuestion(word) {
  /* … */
}
function generateWriteTheWordQuestion(word) {
  /* … */
}
function generateSynonymQuestion(word) {
  /* … */
}
function generateAntonymQuestion(word) {
  /* … */
}
function generateSentenceOrderQuestion(word) {
  /* … */
}
function generateWriteSentenceQuestion(word) {
  /* … */
}

/* ---------- Utilities ---------- */
function getNumQuestionsByLevel(level) {
  if (level === "beginner") return 6;
  if (level === "intermediate") return 4;
  if (level === "advanced") return 3;
  return 2;
}

const generators = [
  generateTranslationQuestion,
  generateArticleQuestion,
  generatePluralQuestion,
  generatePronunciationQuestion,
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateSentenceOrderQuestion,
  generateWriteTheWordQuestion,
  generateWriteSentenceQuestion,
];

function canGenerate(word, name) {
  switch (name) {
    case "generateArticleQuestion":
      return word.type !== "verb" && !!word.article;
    case "generatePluralQuestion":
      return !!word.plural;
    case "generateSynonymQuestion":
      return word.synonyms?.length;
    case "generateAntonymQuestion":
      return word.antonyms?.length;
    case "generateWriteSentenceQuestion":
      return word.examples?.length;
    default:
      return true;
  }
}

function generateQuestionsForWord(word) {
  const list = [];

  if (!word.isReviewed) list.push(generateReviewReminderQuestion(word));

  const needed = getNumQuestionsByLevel(word.level);
  const used = new Set();
  let tries = 0;

  while (list.length < needed + (!word.isReviewed ? 1 : 0) && tries < 30) {
    tries++;
    const gen = generators[Math.floor(Math.random() * generators.length)];
    if (used.has(gen.name)) continue;
    if (!canGenerate(word, gen.name)) continue;

    const q = gen(word);
    if (q) {
      list.push(q);
      used.add(gen.name);
    }
  }

  return list;
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- الجديد: نفصل reviewReminder عن الباقي ونلخبط الباقي ---------- */
function separateReviewReminders(questions) {
  const reminders = questions.filter((q) => q.type === "reviewReminder");
  const others = questions.filter((q) => q.type !== "reviewReminder");
  return { reminders, others };
}

function insertRemindersBeforeFirstQuestion(reminders, others) {
  reminders.forEach((reminder) => {
    const firstIdx = others.findIndex((q) => q._id === reminder._id);
    if (firstIdx === -1) {
      others.unshift(reminder);
    } else {
      others.splice(firstIdx, 0, reminder);
    }
  });
  return others;
}

/* ---------- Utilities ---------- */
function separateReviewReminders(questions) {
  const reminders = questions.filter((q) => q.type === "reviewReminder");
  const others = questions.filter((q) => q.type !== "reviewReminder");
  return { reminders, others };
}

function insertRemindersRandomly(reminders, others) {
  // نسخ المصفوفة الأصلية لتجنب التعديل عليها مباشرة
  const shuffledOthers = [...others];

  // إدراج التذكيرات في مواقع عشوائية
  reminders.forEach((reminder) => {
    const randomPosition = Math.floor(
      Math.random() * (shuffledOthers.length + 1)
    );
    shuffledOthers.splice(randomPosition, 0, reminder);
  });

  return shuffledOthers;
}

/* ---------- Controller ---------- */
async function GenerateQuizzes(req, res) {
  try {
    // ... الكود السابق بدون تغيير حتى توليد الأسئلة ...

    /* توليد الأسئلة */
    const allQuestions = [];
    groups[number - 1].forEach((w) =>
      allQuestions.push(...generateQuestionsForWord(w))
    );

    /* نفصل reviewReminder ونلخبط الباقي */
    const { reminders, others } = separateReviewReminders(allQuestions);
    const shuffledOthers = shuffleArray(others);

    /* نحط reminders في أماكن عشوائية */
    const finalQuestions = insertRemindersRandomly(reminders, shuffledOthers);

    res.status(200).json(finalQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدثت مشكلة في السيرفر" });
  }
}

module.exports = GenerateQuizzes;
