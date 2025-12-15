// Utility functions shared across the application

/**
 * Get the filename for a team member
 * @param {string} member - Member identifier
 * @returns {string} Filename for the member
 */
function getMemberFilename(member) {
    const memberFileMap = window.CONFIG?.MEMBER_FILE_MAP || {
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
    return memberFileMap[member] || member;
}

/**
 * Check if a file is a HEIC/HEIF file
 * @param {File} file - File object to check
 * @returns {boolean} True if file is HEIC/HEIF
 */
function isHeicFile(file) {
    return file.name.toLowerCase().endsWith('.heic') || 
           file.name.toLowerCase().endsWith('.heif') ||
           file.type === 'image/heic' || 
           file.type === 'image/heif';
}

// Expose functions to window for global access
if (typeof window !== 'undefined') {
    window.isHeicFile = isHeicFile;
    window.getMemberFilename = getMemberFilename;
}

