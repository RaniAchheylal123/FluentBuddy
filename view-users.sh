#!/bin/bash
# View All User Data - FluentBuddy

echo "=========================================="
echo "    FluentBuddy - User Data Viewer"
echo "=========================================="
echo ""

cd "/home/admin-022/Project 2/server/database"

echo "📊 ALL REGISTERED USERS:"
echo "===================="
sqlite3 fluentbuddy.db -header -column "SELECT id, username, email, level, created_at FROM users;"

echo ""
echo "📈 USER PROGRESS SUMMARY:"
echo "===================="
sqlite3 fluentbuddy.db -header -column "
SELECT 
  u.username,
  u.email,
  COUNT(p.id) as exercises_completed,
  ROUND(AVG(p.score), 2) as average_score
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
GROUP BY u.id
ORDER BY exercises_completed DESC;
"

echo ""
echo "📝 RECENT ACTIVITY (Last 20):"
echo "===================="
sqlite3 fluentbuddy.db -header -column "
SELECT 
  u.username,
  e.title as exercise,
  p.exercise_type as type,
  p.score,
  p.completed_at as time
FROM progress p
JOIN users u ON p.user_id = u.id
JOIN exercises e ON p.exercise_id = e.id
ORDER BY p.completed_at DESC
LIMIT 20;
"

echo ""
echo "=========================================="
echo "Total Users: $(sqlite3 fluentbuddy.db 'SELECT COUNT(*) FROM users;')"
echo "Total Exercises Completed: $(sqlite3 fluentbuddy.db 'SELECT COUNT(*) FROM progress;')"
echo "=========================================="
