// Node.js script to convert HEIC files to JPG
// Install dependencies: npm install heic-convert
// Run: node scripts/convert-heic-files.js

const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '..', 'Pics', 'PFP TEAM KOAS - 2025 (nov.)');

console.log('HEIC to JPG Converter');
console.log('====================\n');

// Check if heic-convert is available
let heicConvert;
try {
    heicConvert = require('heic-convert');
} catch (e) {
    console.log('❌ heic-convert not installed.');
    console.log('\nTo install: npm install heic-convert');
    console.log('\nAlternative: Use the browser-based converter at public/convert-existing-heic.html');
    console.log('Or manually convert using:');
    console.log('  - macOS: Open in Preview > Export > Format: JPEG');
    console.log('  - Online: https://heictojpg.com/ or https://cloudconvert.com/heic-to-jpg');
    process.exit(1);
}

if (!fs.existsSync(photosDir)) {
    console.error('❌ Photos directory not found:', photosDir);
    process.exit(1);
}

const files = fs.readdirSync(photosDir);
const heicFiles = files.filter(file => 
    file.toLowerCase().endsWith('.heic') || file.toLowerCase().endsWith('.heif')
);

if (heicFiles.length === 0) {
    console.log('✓ No HEIC files found. All files are already converted!');
    process.exit(0);
}

console.log(`Found ${heicFiles.length} HEIC file(s) to convert:\n`);

async function convertHeicToJpg(inputPath, outputPath) {
    try {
        const inputBuffer = fs.readFileSync(inputPath);
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 0.92
        });
        fs.writeFileSync(outputPath, Buffer.from(outputBuffer));
        return true;
    } catch (error) {
        throw error;
    }
}

async function convertAll() {
    let successCount = 0;
    let failCount = 0;

    for (const heicFile of heicFiles) {
        const inputPath = path.join(photosDir, heicFile);
        const jpgFileName = heicFile.replace(/\.heic?$/i, '.jpg');
        const outputPath = path.join(photosDir, jpgFileName);
        
        // Skip if JPG already exists
        if (fs.existsSync(outputPath)) {
            console.log(`⏭  Skipping ${heicFile} - ${jpgFileName} already exists`);
            continue;
        }

        try {
            process.stdout.write(`🔄 Converting ${heicFile}... `);
            await convertHeicToJpg(inputPath, outputPath);
            console.log(`✓ Saved as ${jpgFileName}`);
            successCount++;
        } catch (error) {
            console.log(`✗ Error: ${error.message}`);
            failCount++;
        }
    }

    console.log(`\n✅ Conversion complete!`);
    console.log(`   Success: ${successCount}`);
    if (failCount > 0) {
        console.log(`   Failed: ${failCount}`);
    }
}

convertAll().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

