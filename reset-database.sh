#!/bin/bash
# Reset Database - Fresh Start

echo "🔄 Resetting FluentBuddy Database..."
echo ""

# Backup old database
if [ -f "/home/admin-022/Project 2/server/database/fluentbuddy.db" ]; then
    echo "📦 Creating backup..."
    cp "/home/admin-022/Project 2/server/database/fluentbuddy.db" \
       "/home/admin-022/Project 2/server/database/fluentbuddy_backup_$(date +%Y%m%d_%H%M%S).db"
    echo "✅ Backup created!"
    echo ""
fi

# Delete old database
echo "🗑️  Removing old database..."
rm -f "/home/admin-022/Project 2/server/database/fluentbuddy.db"
echo "✅ Old database removed!"
echo ""

echo "✅ Database reset complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Server will auto-create new database on restart"
echo "   2. All users need to Sign Up again"
echo "   3. Fresh start with no old data"
echo ""
echo "🚀 Ready for fresh start!"
