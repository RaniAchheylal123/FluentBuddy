// Progress tracking functionality
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    requireAuth();
    displayUserInfo();
    initializeLogout();

    // Filter tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.type;
            loadActivities();
        });
    });

    // Load progress data
    loadProgressOverview();
    loadActivities();
});

async function loadProgressOverview() {
    try {
        const response = await fetch(`${API_URL}/progress/overview`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            
            // Update overall stats
            document.getElementById('totalExercises').textContent = data.totalExercises;
            document.getElementById('averageScore').textContent = data.averageScore + '%';

            // Display performance by type
            displayPerformanceByType(data.byType);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function displayPerformanceByType(byType) {
    const performanceDiv = document.getElementById('performanceByType');
    
    if (byType.length === 0) {
        performanceDiv.innerHTML = '<p class="no-activity">No data available yet.</p>';
        return;
    }

    const typeIcons = {
        'speaking': '🎤',
        'writing': '✍️',
        'reading': '📖'
    };

    performanceDiv.innerHTML = byType.map(item => `
        <div class="performance-item">
            <div class="performance-type">
                <span><strong>${typeIcons[item.exercise_type]} ${capitalizeFirst(item.exercise_type)}</strong></span>
                <span><strong>${Math.round(item.avgScore)}%</strong></span>
            </div>
            <div class="performance-bar">
                <div class="performance-fill" style="width: ${item.avgScore}%"></div>
            </div>
            <p style="font-size: 14px; color: var(--text-light); margin-top: 5px;">
                ${item.count} exercise${item.count !== 1 ? 's' : ''} completed
            </p>
        </div>
    `).join('');
}

async function loadActivities() {
    try {
        let url = `${API_URL}/progress/overview`;
        
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            let activities = data.recentActivity;

            // Filter activities if needed
            if (currentFilter !== 'all') {
                activities = activities.filter(a => a.exercise_type === currentFilter);
            }

            displayActivities(activities);
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

function displayActivities(activities) {
    const activityList = document.getElementById('activityList');
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No activities found.</p>';
        return;
    }

    const typeIcons = {
        'speaking': '🎤',
        'writing': '✍️',
        'reading': '📖'
    };

    activityList.innerHTML = activities.map(activity => `
        <div class="timeline-item">
            <div class="timeline-header">
                <div class="timeline-title">
                    ${typeIcons[activity.exercise_type]} ${activity.title}
                </div>
                <div class="timeline-score">${activity.score}%</div>
            </div>
            <div class="timeline-meta">
                ${capitalizeFirst(activity.level)} • ${capitalizeFirst(activity.exercise_type)} • ${formatDate(activity.completed_at)}
            </div>
            ${activity.feedback ? `
                <div class="timeline-feedback">
                    💬 ${activity.feedback}
                </div>
            ` : ''}
        </div>
    `).join('');
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
