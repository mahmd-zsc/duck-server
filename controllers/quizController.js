const { Lesson } = require("../models/lessonModel");

const {
  generateIntroQuestion,
  generateFillInTheBlanksQuestion,
  generateTranslationQuestion,
  generateArticleQuestion,
  generatePluralQuestion,
  generatePronunciationQuestion,
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateSentenceOrderQuestion,
  generateWriteTheWordQuestion,
  generateWriteSentenceQuestion,
} = require("../utils/questionGenerators");
const {
  getWordsNeedingReviewData,
  getHardWords,
} = require("../utils/wordHelpers");
const { getWordsNeedingReview } = require("./wordController");

function calculateLevel(word) {
  let score = 0;

  // عوامل صعوبة
  if (word.isHard) score += 2;
  if (word.synonyms?.length) score += 1;
  if (word.antonyms?.length) score += 1;
  if (word.conjugation?.present) score += 1;

  // عوامل تسهيل
  if (word.reviewCount >= 5) score -= 2;
  if (word.examples?.length >= 2) score -= 1;

  if (score <= 0) return "beginner";
  if (score <= 2) return "intermediate";
  return "advanced";
}

function getNumQuestionsByLevel(level) {
  if (level === "beginner") return 6;
  if (level === "intermediate") return 4;
  if (level === "advanced") return 3;
  return 4;
}

// 🧰 قائمة دوال توليد الأسئلة
const questionGenerators = [
  generateIntroQuestion,
  generateFillInTheBlanksQuestion,
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

const multipleChoiceGenerators = [
  generateTranslationQuestion,
  generateArticleQuestion,
  generatePluralQuestion,
  generateSynonymQuestion,
  generateAntonymQuestion,
];

// ✅ تحقق من إمكانية توليد نوع سؤال معين لكلمة
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
    case "generateFillInTheBlanksQuestion":
      return (
        word.type?.toLowerCase() === "verb" &&
        word.conjugation &&
        word.conjugation.present
      );
    default:
      return true;
  }
}

// 🧠 توليد الأسئلة لكلمة واحدة بناءً على مستواها
function generateQuestionsForWord(word, mode) {
  let numQuestions;

  switch (mode) {
    case "learn":
      numQuestions = 4;
      break;
    case "review":
      numQuestions = 2;
      break;
    case "hard-review":
      numQuestions = 4;
      break;
    case "quick-review":
      numQuestions = 1;
      break;
    default:
      numQuestions = 4;
  }

  const usedTypes = new Set();
  const questions = [];
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  if (mode === "learn") {
    const introQuestion = generateIntroQuestion(word);
    if (introQuestion) questions.push(introQuestion);
  }

  while (questions.length < numQuestions && attempts < MAX_ATTEMPTS) {
    attempts++;

    // ✅ في حالة quick-review هنستخدم فقط multipleChoiceGenerators
    const generatorList =
      mode === "quick-review" ? multipleChoiceGenerators : questionGenerators;

    const randomIndex = Math.floor(Math.random() * generatorList.length);
    const generator = generatorList[randomIndex];

    if (!canGenerateQuestion(word, generator.name)) continue;

    const question = generator(word);

    if (question && !usedTypes.has(generator.name)) {
      questions.push(question);
      usedTypes.add(generator.name);
    }
  }

  return questions;
}

// ترتيب الأسئلة بحيث يظهر intro أولًا
const organizeQuizzes = (quizzes) => {
  const introQuizzesMap = new Map();
  const result = [];
  const usedIntroIds = new Set();

  const regularQuizzes = quizzes.filter((quiz) => {
    if (quiz.type === "intro") {
      introQuizzesMap.set(quiz._id, quiz);
      return false;
    }
    return true;
  });

  regularQuizzes.forEach((quiz) => {
    if (introQuizzesMap.has(quiz._id) && !usedIntroIds.has(quiz._id)) {
      result.push(introQuizzesMap.get(quiz._id));
      usedIntroIds.add(quiz._id);
    }
    result.push(quiz);
  });

  return result;
};

// 🔀 خلط المصفوفة عشوائيًا
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

//--------- Controller ---------

async function GenerateQuizzes(req, res) {
  try {
    const { lessonId, groupSize, groupNumber, mode = "learn" } = req.query;
    if (!groupSize || !groupNumber || !mode) {
      return res.status(400).json({ message: "كل البراميترز مطلوبة" });
    }

    let words;
    let titleOfLesson;
    switch (mode) {
      case "learn":
        const lesson = await Lesson.findById(lessonId).populate("words");
        words = lesson.words;
        titleOfLesson = lesson.title;
        break;
      case "review":
        words = await getWordsNeedingReviewData();
        titleOfLesson = "مراجعة الكلمات السابقة";
        break;
      case "quick-review":
        words = await getWordsNeedingReviewData();
        titleOfLesson = "مراجعة سريعة";

        break;
      case "hard-review":
        words = await getHardWords();
        titleOfLesson = "تحدي الكلمات الصعبة";

        break;
      default:
        return res.status(400).json({ message: "mode مش معروف" });
    }
    if (!words.length) {
      return res.status(404).json({ message: "لا توجد كلمات مناسبة" });
    }

    const size = parseInt(groupSize);
    const number = parseInt(groupNumber);

    const groupedWords = [];
    for (let i = 0; i < words.length; i += size) {
      groupedWords.push(words.slice(i, i + size));
    }

    if (number < 1 || number > groupedWords.length) {
      return res.status(400).json({ message: "رقم المجموعة غير صالح" });
    }

    const selectedGroup = groupedWords[number - 1];
    const quizzes = [];

    selectedGroup.forEach((word) => {
      quizzes.push(...generateQuestionsForWord(word, mode));
    });

    const shuffledQuizzes = shuffleArray(quizzes);
    res.status(200).json({
      quizzes: organizeQuizzes(shuffledQuizzes),
      countOfQuizzes: organizeQuizzes(shuffledQuizzes).length,
      titleOfLesson,
      mode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حصلت مشكلة في السيرفر" });
  }
}
module.exports = GenerateQuizzes;
