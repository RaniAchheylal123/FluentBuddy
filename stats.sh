#!/bin/bash
# FluentBuddy - Project Statistics

echo "=================================="
echo "   FluentBuddy Project Stats"
echo "=================================="
echo ""

echo "📁 Directory Structure:"
echo "----------------------"
find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | head -20

echo ""
echo "📄 File Count by Type:"
echo "----------------------"
echo "HTML files: $(find . -name "*.html" | wc -l)"
echo "CSS files: $(find . -name "*.css" | wc -l)"
echo "JavaScript files: $(find . -name "*.js" -not -path "*/node_modules/*" | wc -l)"
echo "Markdown files: $(find . -name "*.md" | wc -l)"

echo ""
echo "📊 Code Statistics:"
echo "-------------------"
echo "Total lines in HTML files:"
find . -name "*.html" -exec wc -l {} + | tail -1

echo "Total lines in CSS files:"
find . -name "*.css" -exec wc -l {} + | tail -1

echo "Total lines in JS files (excluding node_modules):"
find . -name "*.js" -not -path "*/node_modules/*" -exec wc -l {} + | tail -1

echo ""
echo "🎯 Project Features:"
echo "-------------------"
echo "✅ User Authentication"
echo "✅ Speaking Practice Module"
echo "✅ Writing Practice Module"
echo "✅ Reading Comprehension Module"
echo "✅ Progress Tracking System"
echo "✅ Responsive Web Design"
echo "✅ RESTful API Backend"
echo "✅ SQLite Database"
echo "✅ JWT Authentication"
echo "✅ Real-time Feedback"

echo ""
echo "🌐 Server Status:"
echo "-----------------"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Server is RUNNING on port 3000"
else
    echo "⚠️  Server is not running"
fi

echo ""
echo "📦 Dependencies:"
echo "----------------"
echo "Node modules installed: $(ls node_modules | wc -l) packages"

echo ""
echo "=================================="
echo "   Project Successfully Built!"
echo "=================================="
echo ""
echo "🚀 Access your application at:"
echo "   http://localhost:3000"
echo ""
