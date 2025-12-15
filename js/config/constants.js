// Configuration constants for the application

// Member name to filename mapping
const MEMBER_FILE_MAP = {
    'jack': 'JACK G',
    'michael': 'Michael Koch',
    'alexander': 'Alex',
    'oliver': 'Fenghao Hu Oliver',
    'elena': 'Elena Luquero',
    'ain': 'Ain Kyell',
    'enrico': 'Enrico Spera',
    'tina': 'Tina',
    'rin': 'Rin Arakaki',
    'jarad': 'Jarad',
    'anna': 'Anna',
    'dominik': 'dominik-nikolic',
    'haokai': 'Haokai',
    'shot': 'Shot',
    'sam': 'Sam',
    'david': 'David',
    'mahdi': 'Mahdi',
    'rico': 'Rico'
};

// Photo directory path
const PHOTOS_DIR = 'Pics/PFP TEAM KOAS - 2025 (nov.)';

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MEMBER_FILE_MAP,
        PHOTOS_DIR
    };
}

// Export for browser
if (typeof window !== 'undefined') {
    window.CONFIG = {
        MEMBER_FILE_MAP,
        PHOTOS_DIR
    };
}

