// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    requireAuth();
    
    // Display user info
    displayUserInfo();
    initializeLogout();

    const user = getCurrentUser();
    document.getElementById('username').textContent = user.username;
    document.getElementById('userLevel').textContent = capitalizeFirst(user.level);

    // Load progress overview
    loadProgressOverview();
});

async function loadProgressOverview() {
    try {
        const response = await fetch(`${API_URL}/progress/overview`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            
            // Update stats
            document.getElementById('totalExercises').textContent = data.totalExercises;
            document.getElementById('averageScore').textContent = data.averageScore + '%';

            // Update exercise counts by type
            const byType = {};
            data.byType.forEach(item => {
                byType[item.exercise_type] = item.count;
            });

            document.getElementById('speakingCount').textContent = 
                (byType['speaking'] || 0) + ' completed';
            document.getElementById('writingCount').textContent = 
                (byType['writing'] || 0) + ' completed';
            document.getElementById('readingCount').textContent = 
                (byType['reading'] || 0) + ' completed';

            // Display recent activity
            displayRecentActivity(data.recentActivity);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function displayRecentActivity(activities) {
    const activityList = document.getElementById('recentActivityList');
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No recent activity. Start practicing to see your progress!</p>';
        return;
    }

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${getActivityIcon(activity.exercise_type)} ${activity.title}</h4>
                <p class="activity-meta">
                    ${capitalizeFirst(activity.level)} • ${formatDate(activity.completed_at)}
                </p>
            </div>
            <div class="activity-score">${activity.score}%</div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        'speaking': '🎤',
        'writing': '✍️',
        'reading': '📖'
    };
    return icons[type] || '📝';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return diffMins === 0 ? 'Just now' : `${diffMins} min ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}
