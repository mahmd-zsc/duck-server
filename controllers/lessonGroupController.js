const  LessonGroup  = require('../models/lessonGroupModel'); // تأكد إن ده هو اسم الموديل
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

/**
 * @desc Get all lesson groups
 * @route GET /api/lesson-groups
 * @access Public
 */
const getAllLessonGroups = asyncHandler(async (req, res) => {
  const lessonGroups = await LessonGroup.find().populate('lessons');
  res.status(200).json(lessonGroups);
});

/**
 * @desc Get a single lesson group by ID
 * @route GET /api/lesson-groups/:id
 * @access Public
 */
const getLessonGroupById = asyncHandler(async (req, res) => {
  const lessonGroup = await LessonGroup.findById(req.params.id).populate('lessons');

  if (!lessonGroup) {
    return res.status(404).json({ message: 'المجموعة غير موجودة' });
  }

  res.status(200).json(lessonGroup);
});

/**
 * @desc Create a new lesson group
 * @route POST /api/lesson-groups
 * @access Private/Admin
 */
const createLessonGroup = asyncHandler(async (req, res) => {
  const { title, description, level, lessons } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'العنوان مطلوب' });
  }

  const newGroup = new LessonGroup({
    title,
    description,
    level,
    lessons,
  });

  const savedGroup = await newGroup.save();
  res.status(201).json(savedGroup);
});

/**
 * @desc Update a lesson group by ID
 * @route PUT /api/lesson-groups/:id
 * @access Private/Admin
 */
const updateLessonGroup = asyncHandler(async (req, res) => {
  const { title, description, level, lessons } = req.body;

  const group = await LessonGroup.findById(req.params.id);
  if (!group) {
    return res.status(404).json({ message: 'المجموعة غير موجودة' });
  }

  if (title) group.title = title;
  if (description) group.description = description;
  if (level) group.level = level;
  if (lessons) group.lessons = lessons;

  const updatedGroup = await group.save();
  res.status(200).json(updatedGroup);
});

/**
 * @desc Delete a lesson group by ID
 * @route DELETE /api/lesson-groups/:id
 * @access Private/Admin
 */
const deleteLessonGroup = asyncHandler(async (req, res) => {
  const group = await LessonGroup.findByIdAndDelete(req.params.id);
  if (!group) {
    return res.status(404).json({ message: 'المجموعة غير موجودة' });
  }
  res.status(200).json({ message: 'تم حذف المجموعة بنجاح' });
});

module.exports = {
  getAllLessonGroups,
  getLessonGroupById,
  createLessonGroup,
  updateLessonGroup,
  deleteLessonGroup,
};
