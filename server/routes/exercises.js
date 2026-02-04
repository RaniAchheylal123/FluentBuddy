const express = require('express');
const { db } = require('../database/db');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get exercises by type and level
router.get('/:type', verifyToken, (req, res) => {
  const { type } = req.params;
  const { level } = req.query;

  let query = 'SELECT * FROM exercises WHERE type = ?';
  const params = [type];

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  db.all(query, params, (err, exercises) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching exercises' });
    }
    res.json(exercises);
  });
});

// Get single exercise
router.get('/:type/:id', verifyToken, (req, res) => {
  const { type, id } = req.params;

  db.get('SELECT * FROM exercises WHERE id = ? AND type = ?', [id, type], (err, exercise) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching exercise' });
    }
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  });
});

// Submit exercise answer
router.post('/:type/:id/submit', verifyToken, (req, res) => {
  const { type, id } = req.params;
  const { answer } = req.body;
  const userId = req.userId;

  // Get the exercise
  db.get('SELECT * FROM exercises WHERE id = ? AND type = ?', [id, type], (err, exercise) => {
    if (err || !exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    // Calculate score (simplified scoring)
    let score = 0;
    let feedback = '';

    if (type === 'reading') {
      // For reading comprehension, check if answer contains key words
      const userAnswer = answer.toLowerCase().trim();
      const correctAnswer = exercise.answer.toLowerCase();
      
      if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer)) {
        score = 100;
        feedback = 'Excellent! Your answer is correct.';
      } else if (correctAnswer.split(' ').some(word => userAnswer.includes(word))) {
        score = 60;
        feedback = 'Good effort! Your answer is partially correct. Review the passage again.';
      } else {
        score = 30;
        feedback = 'Keep trying! Read the passage carefully and look for key information.';
      }
    } else if (type === 'speaking') {
      // For speaking, provide general feedback (in real app, would use speech recognition API)
      const wordCount = answer.split(' ').length;
      if (wordCount >= 10) {
        score = 85;
        feedback = 'Good job! Your response was clear and complete.';
      } else {
        score = 60;
        feedback = 'Good start! Try to provide more detailed responses.';
      }
    } else if (type === 'writing') {
      // For writing, check length and basic structure
      const wordCount = answer.split(' ').length;
      const hasCapital = /[A-Z]/.test(answer);
      const hasPunctuation = /[.!?]/.test(answer);
      
      if (wordCount >= 20 && hasCapital && hasPunctuation) {
        score = 85;
        feedback = 'Well done! Your writing is clear and well-structured.';
      } else if (wordCount >= 10) {
        score = 65;
        feedback = 'Good effort! Try to write more and use proper capitalization and punctuation.';
      } else {
        score = 45;
        feedback = 'Keep practicing! Try to write longer responses with complete sentences.';
      }
    }

    // Save progress
    db.run(
      'INSERT INTO progress (user_id, exercise_id, exercise_type, score, completed, feedback) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, id, type, score, 1, feedback],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error saving progress' });
        }

        res.json({
          message: 'Exercise submitted successfully',
          score,
          feedback,
          progressId: this.lastID
        });
      }
    );
  });
});

module.exports = router;
