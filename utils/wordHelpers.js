// utils/wordHelpers.js

const { Word } = require("../models/wordModel");

const getWordsNeedingReviewData = async () => {
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const words = await Word.find({
    isReviewed: true, // المستخدم حل عليها قبل كده
    $or: [
      { reviewCount: { $lt: 3 } }, // عدد المراجعات قليل
      {
        lastReviewed: { $exists: true, $lt: new Date(now - THREE_DAYS_MS) }, // مر وقت طويل
      },
      {
        lastReviewed: { $exists: false }, // مفيش تاريخ مراجعة
      },
    ],
  });

  return words;
};

const getHardWords = async () => {
  const words = await Word.find({ isHard: true });
  return words;
};

module.exports = { getWordsNeedingReviewData, getHardWords };
