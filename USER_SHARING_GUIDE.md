# 🎯 FluentBuddy - User Sharing & Data Tracking Guide

## ✅ Setup Complete! Ab Users Ko Share Karo

---

## 📱 STEP 1: Users Ko Ye URL Do

### Same WiFi/Network Par:
```
http://192.168.87.38:3000
```

**Important:** 
- ✅ User aur aap **same WiFi** par hone chahiye
- ✅ Aapka computer ON hona chahiye
- ✅ Server running hona chahiye

---

## 👥 STEP 2: User Kaise Use Karenge

### User Ka Process:
1. Browser me URL open kare: `http://192.168.87.38:3000`
2. "Sign Up" button click kare
3. Apni details bhare:
   - Username
   - Email
   - Password
   - Level (Beginner/Intermediate/Advanced)
4. Sign up kare
5. Exercises complete kare
6. **Data automatically save ho jayega!**

---

## 📊 STEP 3: User Data Kaise Dekhe

### Method 1: Script Run Karo (EASIEST)

Terminal me ye command run karo:
```bash
/home/admin-022/Project\ 2/view-users.sh
```

Ye dikhayega:
- ✅ Sabhi registered users
- ✅ Unka progress summary
- ✅ Recent activity
- ✅ Scores aur timestamps

### Method 2: Direct Database Query

```bash
cd "/home/admin-022/Project 2/server/database"

# Sabhi users dekho
sqlite3 fluentbuddy.db "SELECT * FROM users;"

# Specific user ka data
sqlite3 fluentbuddy.db "SELECT * FROM users WHERE email='user@example.com';"

# User progress dekho
sqlite3 fluentbuddy.db "SELECT u.username, p.* FROM progress p JOIN users u ON p.user_id = u.id;"
```

### Method 3: Real-time Monitoring

Terminal me ye command run karo (continuous monitoring):
```bash
watch -n 5 "/home/admin-022/Project 2/view-users.sh"
```

Har 5 seconds me update hoga!

---

## 📋 User Data Export Karo

### CSV File Me Export:
```bash
cd "/home/admin-022/Project 2/server/database"

# Users export
sqlite3 -header -csv fluentbuddy.db "SELECT * FROM users;" > users.csv

# Progress export
sqlite3 -header -csv fluentbuddy.db "SELECT * FROM progress;" > progress.csv

# Combined report
sqlite3 -header -csv fluentbuddy.db "
SELECT 
  u.username,
  u.email,
  e.title as exercise,
  p.exercise_type,
  p.score,
  p.feedback,
  p.completed_at
FROM progress p
JOIN users u ON p.user_id = u.id
JOIN exercises e ON p.exercise_id = e.id
ORDER BY p.completed_at DESC;
" > full_report.csv
```

---

## 🌐 STEP 4: Internet Par Share Karo (Optional)

Agar different network se bhi access karna ho:

### Option A: Ngrok (Temporary - Free)
```bash
# Install ngrok
# Then run:
ngrok http 3000
```
Jo URL milega wo kisi ko bhi share kar sakte ho!

### Option B: Deploy on Render.com (Permanent - Free)

1. GitHub par code push karo
2. Render.com pe account banao
3. Connect GitHub repo
4. Deploy karo
5. Public URL milega

---

## 📊 Quick Commands Cheat Sheet

```bash
# Server start karo
cd "/home/admin-022/Project 2" && npm start

# User data dekho
/home/admin-022/Project\ 2/view-users.sh

# Real-time monitoring
watch -n 5 "/home/admin-022/Project 2/view-users.sh"

# Database backup
cp "/home/admin-022/Project 2/server/database/fluentbuddy.db" ~/backup_$(date +%Y%m%d).db

# Specific user search
sqlite3 "/home/admin-022/Project 2/server/database/fluentbuddy.db" \
  "SELECT * FROM users WHERE username LIKE '%search%';"
```

---

## 🎯 Summary

### Users Ko Share Karne Ke Liye:
1. ✅ Server running rakho
2. ✅ URL share karo: `http://192.168.87.38:3000`
3. ✅ Users sign up karenge
4. ✅ Data automatically save hoga

### Data Dekhne Ke Liye:
1. ✅ Run karo: `/home/admin-022/Project\ 2/view-users.sh`
2. ✅ Ya database query karo
3. ✅ CSV export kar sakte ho

### Important:
- 🔴 Server band ho to website nahi chalegi
- 🔴 Computer band ho to access nahi hoga
- 🟢 Deploy karo permanent access ke liye

---

## 🆘 Troubleshooting

### User access nahi kar pa raha?
```bash
# Firewall check karo
sudo ufw status

# Allow port 3000
sudo ufw allow 3000
```

### Server crash ho gaya?
```bash
# Restart karo
cd "/home/admin-022/Project 2" && npm start
```

### Data nahi dikh raha?
```bash
# Database check karo
ls -lh "/home/admin-022/Project 2/server/database/fluentbuddy.db"

# Permissions fix karo
chmod 666 "/home/admin-022/Project 2/server/database/fluentbuddy.db"
```

---

**Sab kuch ready hai! Users ko URL share karo aur data track karo! 🚀**
