// Configuration file for FluentBuddy
// Modify these settings to customize your application

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },

    // Database Configuration
    database: {
        name: 'fluentbuddy.db',
        path: './server/database/'
    },

    // Authentication Configuration
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        jwtExpiration: '7d',
        saltRounds: 10
    },

    // Exercise Settings
    exercises: {
        levels: ['beginner', 'intermediate', 'advanced'],
        types: ['speaking', 'writing', 'reading'],
        
        // Scoring thresholds
        scoring: {
            excellent: 80,  // >= 80% is excellent
            good: 60,       // >= 60% is good
            passing: 40     // >= 40% is passing
        }
    },

    // Speech Recognition Settings
    speech: {
        language: 'en-US',
        continuous: false,
        interimResults: false
    },

    // API Configuration
    api: {
        baseUrl: 'http://localhost:3000/api',
        timeout: 30000 // 30 seconds
    },

    // UI Settings
    ui: {
        theme: {
            primaryColor: '#4f46e5',
            secondaryColor: '#10b981',
            dangerColor: '#ef4444',
            warningColor: '#f59e0b'
        },
        pagination: {
            itemsPerPage: 10
        }
    },

    // Feature Flags
    features: {
        speechRecognition: true,
        progressTracking: true,
        multipleAttempts: true,
        hints: true
    }
};

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

// Make available globally for browser (frontend)
if (typeof window !== 'undefined') {
    window.FluentBuddyConfig = config;
}
