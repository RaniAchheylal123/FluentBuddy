// Writing practice functionality
let currentLevel = 'beginner';
let currentExercise = null;

document.addEventListener('DOMContentLoaded', function() {
    requireAuth();
    displayUserInfo();
    initializeLogout();

    // Level selector
    const levelBtns = document.querySelectorAll('.level-btn');
    levelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            levelBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLevel = this.dataset.level;
            loadExercises();
        });
    });

    // Modal controls
    const modal = document.getElementById('exerciseModal');
    const closeBtn = modal.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetExercise();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetExercise();
        }
    });

    // Writing input with word count
    const writingInput = document.getElementById('writingInput');
    writingInput.addEventListener('input', updateWritingStats);

    // Submit button
    document.getElementById('submitWriting').addEventListener('click', submitWriting);

    // Load initial exercises
    loadExercises();
});

async function loadExercises() {
    try {
        const response = await fetch(`${API_URL}/exercises/writing?level=${currentLevel}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const exercises = await response.json();
            displayExercises(exercises);
        }
    } catch (error) {
        console.error('Error loading exercises:', error);
    }
}

function displayExercises(exercises) {
    const exercisesList = document.getElementById('exercisesList');
    
    if (exercises.length === 0) {
        exercisesList.innerHTML = '<p class="no-activity">No exercises available for this level.</p>';
        return;
    }

    exercisesList.innerHTML = exercises.map(exercise => `
        <div class="exercise-card" onclick="openExercise(${exercise.id})">
            <div class="exercise-level-badge level-${exercise.level}">${exercise.level}</div>
            <h3>${exercise.title}</h3>
            <p>${exercise.content.substring(0, 150)}...</p>
        </div>
    `).join('');
}

function openExercise(exerciseId) {
    fetch(`${API_URL}/exercises/writing/${exerciseId}`, {
        headers: getAuthHeaders()
    })
    .then(response => response.json())
    .then(exercise => {
        currentExercise = exercise;
        document.getElementById('exerciseTitle').textContent = exercise.title;
        document.getElementById('exerciseLevelBadge').textContent = exercise.level;
        document.getElementById('exerciseLevelBadge').className = 
            `exercise-level-badge level-${exercise.level}`;
        document.getElementById('exerciseDescription').textContent = exercise.content;
        document.getElementById('exerciseHints').textContent = exercise.hints;
        
        document.getElementById('exerciseModal').style.display = 'block';
    })
    .catch(error => {
        console.error('Error loading exercise:', error);
        alert('Error loading exercise');
    });
}

function updateWritingStats() {
    const text = document.getElementById('writingInput').value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;

    document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
    document.getElementById('charCount').textContent = `Characters: ${charCount}`;
}

async function submitWriting() {
    const writingText = document.getElementById('writingInput').value.trim();
    
    if (!writingText) {
        alert('Please write your response first.');
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/exercises/writing/${currentExercise.id}/submit`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ answer: writingText })
            }
        );

        if (response.ok) {
            const result = await response.json();
            displayFeedback(result);
        } else {
            alert('Error submitting answer');
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Error submitting answer');
    }
}

function displayFeedback(result) {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.className = 'feedback show';
    
    if (result.score >= 80) {
        feedbackDiv.classList.add('success');
    } else if (result.score >= 60) {
        feedbackDiv.classList.add('warning');
    } else {
        feedbackDiv.classList.add('error');
    }

    feedbackDiv.innerHTML = `
        <h3>Score: ${result.score}%</h3>
        <p>${result.feedback}</p>
        <button class="btn-primary" onclick="closeExerciseAndReload()">Continue</button>
    `;
}

function resetExercise() {
    currentExercise = null;
    document.getElementById('writingInput').value = '';
    document.getElementById('wordCount').textContent = 'Words: 0';
    document.getElementById('charCount').textContent = 'Characters: 0';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('feedback').innerHTML = '';
}

function closeExerciseAndReload() {
    document.getElementById('exerciseModal').style.display = 'none';
    resetExercise();
    loadExercises();
}

// Make functions available globally
window.openExercise = openExercise;
window.closeExerciseAndReload = closeExerciseAndReload;
